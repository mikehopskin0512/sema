import _, { isEmpty } from 'lodash';
import Bluebird from 'bluebird';
import {
  endOfDay,
  toDate,
  differenceInCalendarDays,
  format,
  sub,
} from 'date-fns';
import Repository from './repositoryModel';
import Users from '../users/userModel';
import { getReactionIdKeys } from '../comments/reaction/reactionService';
import { getRepoUsersMetrics } from '../users/userService';
import {
  findByRepositoryId as findSmartCommentsByRepositoryId,
  getRepoSmartCommentsMetrics,
  getUniqueCommenters,
  getUniquePullRequests,
  getUniqueRequesters,
} from '../comments/smartComments/smartCommentService';
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
  const repository = await Repository.findOrCreate(
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
  await Promise.all(repositories.map(create));
};

export const createAndSyncReposFromGithub = async (
  reposFroGithub,
  createdBy
) => {
  await Promise.all(
    reposFroGithub.map(async (repoFromGithub) => {
      const existingRepo = await Repository.findOne({
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
};

export const get = async (_id) => {
  const query = Repository.find({ _id });
  const repository = await query
    .lean()
    .populate('sourceId', 'externalSourceId')
    .exec();

  return repository;
};

export const findByOrg = async (orgId) => {
  const query = Repository.find({ orgId });
  const repositories = await query
    .lean()
    .populate('sourceId', 'externalSourceId')
    .exec();

  return repositories;
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
  const query = Repository.findOne({ externalId });
  const repository = await query.lean().exec();

  return repository;
};

export const getRepository = async (_id) => {
  const query = Repository.findOne({ _id });
  return await query.exec();
};

export const getRepositories = async (params, populateUsers) => {
  const { ids, searchQuery = '' } = params;
  const searchRegEx = new RegExp(searchQuery, 'ig');

  const query = Repository.find({
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
};

export const findByExternalIds = async (params, populateUsers) => {
  const { externalIds, searchQuery } = params;
  const searchRegEx = new RegExp(searchQuery, 'ig');

  const query = Repository.find({
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
            ? await findSmartCommentsByRepositoryId(
                _id,
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
};

export const aggregateReactions = async (externalId, dateFrom, dateTo) => {
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
  const repositories = await Repository.aggregate([
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
};

export const aggregateTags = async (externalId, dateFrom, dateTo) => {
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
  const repositories = await Repository.aggregate([
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
};

export const getSemaUsersOfRepo = async (externalId) => {
  const users = await Users.find({
    'identities.repositories': { $elemMatch: { id: externalId } },
  }).exec();
  return users;
};

export const getRepoByUserIds = async (userIds = [], populateUsers = false) => {
  const query = Repository.find({ 'repoStats.userIds': { $in: userIds } });
  if (populateUsers) {
    query.populate({ path: 'repoStats.userIds', model: 'User' });
  }
  const repositories = await query.sort({ updatedAt: -1 }).exec();
  return repositories;
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
  if (isEmpty(filterFields)) {
    return {};
  }

  const repositories = (
    await Repository.find({ externalId: repos })
      .select({ _id: 1, fullName: 1, externalId: 1 })
      .lean()
  ).map((o) => ({
    name: o.fullName,
    label: o.fullName,
    value: o._id,
    externalId: o.externalId,
  }));
  const repositoryIds = repositories.map((o) => o.value);

  return await Bluebird.props({
    repos: repositories,
    authors: filterFields.authors
      ? await getAuthorFilterValues(repositoryIds, startDate, endDate)
      : undefined,
    requesters: filterFields.requesters
      ? await getRequesterFilterValues(repositoryIds, startDate, endDate)
      : undefined,
    pullRequests: filterFields.pullRequests
      ? await getPullRequestFilterValues(repositoryIds, startDate, endDate)
      : undefined,
  });
};

async function getAuthorFilterValues(repos, startDate, endDate) {
  const authors = await getUniqueCommenters(repos, startDate, endDate);
  return authors
    .map((author) => {
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
    })
    .filter((element) => element.label)
    .sort(compareBy('label'));
}

async function getRequesterFilterValues(repos, startDate, endDate) {
  const requesters = await getUniqueRequesters(repos, startDate, endDate);
  return requesters
    .filter((item) => item.githubMetadata.requester)
    .map((el) => {
      const {
        githubMetadata: { requester, requesterAvatarUrl },
      } = el;
      return {
        label: requester,
        value: requester,
        img: requesterAvatarUrl || DEFAULT_AVATAR,
      };
    })
    .filter((element) => element.label)
    .sort(compareBy('label'));
}

async function getPullRequestFilterValues(repos, startDate, endDate) {
  const pullRequests = await getUniquePullRequests(repos, startDate, endDate);
  return pullRequests
    .map((pr) => {
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
    })
    .filter((element) => element.label)
    .sort((a, b) => parseInt(b.value, 10) - parseInt(a.value, 10));
}

function compareBy(field) {
  return (a, b) => a[field].localeCompare(b[field]);
}

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
