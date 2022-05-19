import _ from 'lodash';
import {
  endOfDay,
  toDate,
  differenceInCalendarDays,
  format,
  sub,
} from 'date-fns';
import Repositories from './repositoryModel';
import Users from '../users/userModel';
import { getReactionIdKeys } from '../comments/reaction/reactionService';
import { getRepoUsersMetrics } from '../users/userService';
import {
  findByExternalId as findSmartCommentsByExternalId,
  getRepoSmartCommentsMetrics,
} from '../comments/smartComments/smartCommentService';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { metricsStartDate } from '../shared/utils';
import publish from '../shared/sns';
import { queue as importRepositoryQueue } from '../repoSync/importRepositoryQueue';

const snsTopic = process.env.AMAZON_SNS_CROSS_REGION_TOPIC;

export const create = async ({
  id: externalId,
  name,
  language,
  description,
  type,
  installationId,
  cloneUrl,
  addedBy,
  created_at: repositoryCreatedAt,
  updated_at: repositoryUpdatedAt,
}) => {
  try {
    const repository = await Repositories.create({
      externalId,
      name,
      description,
      type,
      installationId,
      'sync.addedBy': addedBy,
      language,
      cloneUrl,
      repositoryCreatedAt,
      repositoryUpdatedAt,
    });
    await handleRepoSync(repository);
    return repository;
  } catch (err) {
    const isDuplicate =
      err.code === 11000 && err.keyPattern?.type && err.keyPattern?.externalId;
    if (isDuplicate) {
      const repository = await Repositories.findOne({ type, externalId });
      await handleRepoSync(repository);
      return repository;
    }
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

async function handleRepoSync(repository) {
  const shouldStartSync = !!(
    repository.type === 'github' && repository.installationId
  );
  if (shouldStartSync) {
    await importRepositoryQueue.queueJob({ id: repository.id });
  }
}

export const createMany = async (repositories) => {
  try {
    const updatedRepositories = await Repositories.insertMany(repositories, {
      ordered: false,
    });
    return updatedRepositories;
  } catch (err) {
    // When using "unordered" insertMany, Mongo will ignore dup key errors and only insert new records
    // However it will throw an error, so data needs to be conditionally returned via catch block
    const { name, insertedDocs = [] } = err;
    if (name === 'BulkWriteError' && insertedDocs.length > 0) {
      return insertedDocs;
    }

    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const get = async (_id) => {
  try {
    const query = Repositories.find({ _id });
    const repository = await query
      .lean()
      .populate('sourceId', 'externalSourceId')
      .exec();

    return repository;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findByOrg = async (orgId) => {
  try {
    const query = Repositories.find({ orgId });
    const repositories = await query
      .lean()
      .populate('sourceId', 'externalSourceId')
      .exec();

    return repositories;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const sendNotification = async (msg) => {
  if (!snsTopic) return false;

  const snsFilter = {
    action: {
      DataType: 'String',
      StringValue: 'createRepo',
    },
  };

  const result = await publish(snsTopic, { repos: msg }, snsFilter);
  return result;
};

export const createOrUpdate = async (repository) => {
  if (!repository.externalId) return false;
  try {
    await Repositories.update(
      { externalId: repository.externalId },
      repository,
      { upsert: true, setDefaultsOnInsert: true }
    );
    return true;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findByExternalId = async (externalId) => {
  // externalId is github id
  try {
    const query = Repositories.findOne({ externalId });
    const repository = await query.lean().exec();

    return repository;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getRepository = async (_id) => {
  try {
    const query = Repositories.findOne({ _id });
    return await query.exec();
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getRepositories = async (params, populateUsers) => {
  const { ids, searchQuery = '' } = params;
  try {
    const searchRegEx = new RegExp(searchQuery, 'ig');

    const query = Repositories.find({
      _id: { $in: ids },
      name: { $regex: searchRegEx },
    });
    if (populateUsers) {
      query.populate({
        path: 'repoStats.userIds',
        select: 'avatarUrl',
        model: 'User',
      });
    }
    const repositories = await query.lean();
    return repositories;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findByExternalIds = async (params, populateUsers) => {
  const { externalIds, searchQuery } = params;
  const searchRegEx = new RegExp(searchQuery, 'ig');

  try {
    const query = Repositories.find({
      externalId: { $in: externalIds },
      name: { $regex: searchRegEx },
    });
    if (populateUsers) {
      query.populate({
        path: 'repoStats.userIds',
        select: 'avatarUrl',
        model: 'User',
      });
    }
    const repositories = await query.lean();
    return repositories;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

async function getRepoMetrics(externalId) {
  const usersMetrics = await getRepoUsersMetrics(externalId);
  const commentsMetrics = await getRepoSmartCommentsMetrics(externalId);
  const auxDate = new Date(metricsStartDate);
  const today = new Date();
  let metrics = [];
  while (auxDate <= today) {
    const dateAsString = auxDate.toISOString().split('T')[0];
    const values = commentsMetrics?.[dateAsString] ?? {
      comments: 0,
      pullRequests: 0,
      commenters: 0,
    };
    values.users = usersMetrics?.[dateAsString] ?? 0;
    metrics = [...metrics, values];
    auxDate.setDate(auxDate.getDate() + 1);
  }
  return metrics;
}

export const aggregateRepositories = async (
  params,
  includeSmartComments,
  date
) => {
  try {
    // Get Repos by externalId
    const repos = await findByExternalIds(params, true);
    if (repos.length > 0) {
      // Tally stats
      const repositories = Promise.all(
        repos.map(async (repo) => {
          const {
            _id,
            externalId = '',
            name = '',
            createdAt,
            updatedAt,
            repoStats,
          } = repo;
          const {
            smartComments = 0,
            smartCommenters = 0,
            smartCodeReviews = 0,
            semaUsers = 0,
            ...rawRepoStats
          } = repoStats;
          const metrics = await getRepoMetrics(externalId);
          const data = {
            repoStats: {
              smartComments,
              smartCommenters,
              smartCodeReviews,
              semaUsers,
              ...rawRepoStats,
            },
            metrics,
            _id,
            externalId,
            name,
            createdAt,
            users: repo.repoStats.userIds,
            updatedAt,
            smartcomments: includeSmartComments
              ? await findSmartCommentsByExternalId(
                  externalId,
                  true,
                  date
                    ? {
                        $gte: toDate(new Date(date.startDate)),
                        $lte: toDate(endOfDay(new Date(date.endDate))),
                      }
                    : undefined
                )
              : null,
          };
          return data;
        })
      );
      return repositories;
    }
    return [];
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const aggregateReactions = async (externalId, dateFrom, dateTo) => {
  try {
    const condition = {
      $and: [],
    };
    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    let dateDuration = differenceInCalendarDays(to, from);
    if (dateFrom) {
      condition.$and.push({ $gt: ['$$el.createdAt', from] });
    }
    if (dateTo) {
      condition.$and.push({ $lt: ['$$el.createdAt', to] });
    }
    const repositories = await Repositories.aggregate([
      { $match: { externalId } },
      {
        $project: {
          externalId: 1,
          name: 1,
          repoStats: {
            $map: {
              input: {
                $filter: {
                  input: '$repoStats.reactions',
                  as: 'el',
                  // "cond": {
                  //   "$and": [ { "$gt": ["$$el.createdAt", from ] }, { "$lt": ["$$el.createdAt", to ] } ]
                  // },
                  cond: condition,
                },
              },
              as: 'item',
              in: '$$item',
            },
          },
        },
      },
    ]);
    const repo = repositories[0];
    const reactions = await getReactionIdKeys();

    if (dateDuration > 7) {
      dateDuration = 7;
    } else {
      dateDuration += 1;
    }
    const duration = [...Array(dateDuration).keys()];

    const parsedReactions = duration.map((d) => {
      const localReactions = { ...reactions };
      const parsedDateTo = sub(to, { days: d });
      const formattedToDate = format(parsedDateTo, 'MM/dd/yyyy');
      const date = format(parsedDateTo, 'MM/dd');
      localReactions.date = date;
      repo.repoStats.forEach((stat) => {
        const reaction = stat.reactionId;
        const dataDate = new Date(stat.createdAt);
        const formattedDataDate = format(dataDate, 'MM/dd/yyyy');
        if (formattedDataDate === formattedToDate) {
          if (localReactions?.[reaction]) {
            localReactions[reaction] += 1;
          } else {
            localReactions[reaction] = 1;
          }
        }
      });
      return localReactions;
    });
    return parsedReactions;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const aggregateTags = async (externalId, dateFrom, dateTo) => {
  try {
    const condition = {
      $and: [],
    };
    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    if (dateFrom) {
      condition.$and.push({ $gt: ['$$el.createdAt', from] });
    }
    if (dateTo) {
      condition.$and.push({ $lt: ['$$el.createdAt', to] });
    }
    const repositories = await Repositories.aggregate([
      { $match: { externalId } },
      {
        $project: {
          externalId: 1,
          name: 1,
          repoStats: {
            $map: {
              input: {
                $filter: {
                  input: '$repoStats.tags',
                  as: 'el',
                  // "cond": {
                  //   "$and": [ { "$gt": ["$$el.createdAt", from ] }, { "$lt": ["$$el.createdAt", to ] } ]
                  // },
                  cond: condition,
                },
              },
              as: 'item',
              in: '$$item',
            },
          },
        },
      },
    ]);
    const repo = repositories[0];
    const tags = {};

    repo.repoStats.forEach((stat) => {
      const { tagsId } = stat;
      const dataDate = new Date(stat.createdAt);
      const formattedDataDate = format(dataDate, 'MM/dd/yy');
      tagsId?.forEach((tag) => {
        if (tags?.[tag]) {
          tags[tag].total += 1;
          const index = _.findIndex(
            tags[tag].tally,
            (o) => o.date === formattedDataDate
          );
          if (index === -1) {
            tags[tag].tally.push({
              date: formattedDataDate,
              tags: 1,
            });
          } else {
            tags[tag].tally[index].tags += 1;
          }
        } else {
          tags[tag] = {
            total: 1,
            tally: [
              {
                date: formattedDataDate,
                tags: 1,
              },
            ],
          };
        }
      });
    });
    return tags;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getSemaUsersOfRepo = async (externalId) => {
  try {
    const users = await Users.find({
      'identities.repositories': { $elemMatch: { id: externalId } },
    }).exec();
    return users;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getRepoByUserIds = async (userIds = [], populateUsers = false) => {
  try {
    const query = Repositories.find({ 'repoStats.userIds': { $in: userIds } });
    if (populateUsers) {
      query.populate({ path: 'repoStats.userIds', model: 'User' });
    }
    const repositories = await query.sort({ updatedAt: -1 }).exec();
    return repositories;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};
