import _, { isEmpty } from 'lodash';
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
  getUniqueCommenters,
  getUniquePullRequests,
  getUniqueRequesters,
} from '../comments/smartComments/smartCommentService';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { metricsStartDate } from '../shared/utils';
import publish from '../shared/sns';
import { queue as importRepositoryQueue } from '../repoSync/importRepositoryQueue';
import { DEFAULT_AVATAR } from '../constants';
import { createNewOrgsFromGithub } from '../organizations/organizationService';

const snsTopic = process.env.AMAZON_SNS_CROSS_REGION_TOPIC;

export const create = async ({
  id: externalId,
  name,
  language,
  description,
  type,
  cloneUrl,
  visibility,
  created_at: repositoryCreatedAt,
  updated_at: repositoryUpdatedAt,
  owner,
  user,
}) => {
  try {
    const repository = await Repositories.findOrCreate(
      { type, externalId },
      {
        name,
        description,
        language,
        cloneUrl,
        visibility,
        repositoryCreatedAt,
        repositoryUpdatedAt,
      }
    );

    const isOrganization = owner?.type === 'Organization';
    if (isOrganization) {
      const [organization] = await createNewOrgsFromGithub([owner], user);
      repository.set({ orgId: organization });
      await repository.save();
      organization.repos.addToSet(repository._id);
      await organization.save();
    }
    return repository;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const startSync = async ({ repository, user }) => {
  // eslint-disable-next-line no-param-reassign
  repository.sync = {
    status: 'queued',
    queuedAt: new Date(),
    addedBy: user,
  };
  await repository.save();
  await importRepositoryQueue.queueJob({ id: repository.id });
};

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

export const createAndSyncReposFromGithub = async (
  reposFroGithub,
  createdBy
) => {
  try {
    await Promise.all(
      reposFroGithub.map(async (repoFromGithub) => {
        const existingRepo = await Repositories.findOne({
          externalId: repoFromGithub.repoId,
        });
        if (!existingRepo) {
          // create and add to sync queue
          return create({
            id: repoFromGithub.repoId,
            name: repoFromGithub.repoName,
            description: repoFromGithub.description,
            addedBy: createdBy,
            type: 'github',
          });
        }
        return false;
      })
    );
  } catch (err) {
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
            fullName = null,
            createdAt,
            updatedAt,
            repoStats,
            sync,
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
            fullName,
            createdAt,
            users: repo.repoStats.userIds,
            updatedAt,
            sync: getSyncResponse(sync),
            visibility: repo.visibility,
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

/*
  Return the values for the filters.
  From - authors
  To - requesters
  Pull requests - pullRequests
  Repos - repos
*/
export const getReposFilterValues = async (
  repos,
  startDate,
  endDate,
  filterFields = {}
) => {
  try {
    const filterValues = {};
    if (isEmpty(filterFields)) {
      return {};
    }

    if (filterFields.authors) {
      const authors = await getUniqueCommenters(repos, startDate, endDate);
      filterValues.authors = authors.map((author) => {
        const {
          user: { firstName, lastName, _id, avatarUrl, username },
        } = author;
        return {
          label:
            isEmpty(firstName) && isEmpty(lastName)
              ? username.split('@')[0]
              : `${firstName} ${lastName}`,
          value: _id,
          img: avatarUrl || DEFAULT_AVATAR,
        };
      });
    }

    if (filterFields.requesters) {
      const requesters = await getUniqueRequesters(repos, startDate, endDate);
      filterValues.requesters = requesters.map((el) => {
        const {
          githubMetadata: { requester, requesterAvatarUrl },
        } = el;
        return {
          label: requester,
          value: requester,
          img: requesterAvatarUrl || DEFAULT_AVATAR,
        };
      });
    }

    if (filterFields.pullRequests) {
      const pullRequests = await getUniquePullRequests(
        repos,
        startDate,
        endDate
      );
      filterValues.pullRequests = pullRequests.map((pr) => {
        const {
          githubMetadata: {
            head,
            title = '',
            pull_number: pullNum = '',
            updated_at,
          },
        } = pr;
        const prName = title || head || 'Pull Request';
        return {
          updated_at: new Date(updated_at),
          label: `${prName} (#${pullNum || '0'})`,
          value: pullNum,
          name: prName,
        };
      });
    }
    return filterValues;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

function getSyncResponse(sync) {
  if (!sync?.progress) return sync;

  const { progress } = sync;

  const current = Object.keys(progress)
    .map((key) => progress[key].currentPage || 0)
    .reduce((a, b) => a + b, 0);

  const total = Object.keys(progress)
    .map((key) => progress[key].lastPage || 0)
    .reduce((a, b) => a + b, 0);

  // Deal with some data inconsistency where the lastPage is not set.
  const overall = Math.min(1, current / total).toFixed(2);

  return {
    ...sync,
    progress: {
      overall,
      ...sync.progress,
    },
  };
}
