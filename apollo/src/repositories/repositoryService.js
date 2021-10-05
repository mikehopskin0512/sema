import mongoose from "mongoose";
import _ from "lodash";
import { endOfDay, toDate, differenceInCalendarDays, format, sub } from "date-fns";
import Repositories from './repositoryModel';
import Users from './../users/userModel';
import { getReactionIdKeys } from "../comments/reaction/reactionService";
import { findByExternalId as findSmartCommentsByExternalId } from '../comments/smartComments/smartCommentService';
import logger from '../shared/logger';
import errors from '../shared/errors';
import publish from '../shared/sns';

const snsTopic = process.env.AMAZON_SNS_CROSS_REGION_TOPIC;

export const create = async (repository) => {
  try {
    const {
      id: externalId, name, language, description, type,
      cloneUrl,
      created_at: repositoryCreatedAt, updated_at: repositoryUpdatedAt
    } = repository;
    const newRepository = new Repositories({
      externalId,
      name,
      description,
      type,
      language,
      cloneUrl,
      repositoryCreatedAt,
      repositoryUpdatedAt
    })
    const savedRepository = await newRepository.save();
    return savedRepository;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const createMany = async (repositories) => {
  try {
    const updatedRepositories = await Repositories.insertMany(repositories, { ordered: false });
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
    throw (error);
  }
};

export const get = async (_id) => {
  try {
    const query = Repositories.find({ _id });
    const repository = await query.lean().populate('sourceId', 'externalSourceId').exec();

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
    const repositories = await query.lean().populate('sourceId', 'externalSourceId').exec();

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
    const query = await Repositories.update({ externalId: repository.externalId }, repository, { upsert: true, setDefaultsOnInsert: true });
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
}

export const getRepository = async (_id) => {
  try {
    const query = Repositories.findOne({ _id });
    const repository = await query.lean().exec();

    return repository;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findByExternalIds = async (externalIds, populateUsers) => {
  try {
    const query = Repositories.find({ 'externalId': { $in: externalIds } });
    if (populateUsers) {
      query.populate({ path: 'repoStats.userIds', model: 'User' });
    }
    const repositories = await query.exec();
    return repositories;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const aggregateRepositories = async (externalIds, includeSmartComments, date) => {
  try {
    // const repoRaw = await Repositories.aggregate([
    //   {
    //     $match: {
    //       externalId: {
    //         $in: externalIds
    //       }
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'smartComments',
    //       as: 'smartComments',
    //       let: { externalId: '$externalId' },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $eq: [ '$githubMetadata.repo_id', '$$externalId' ]
    //             }
    //           }
    //         },
    //         {
    //           $lookup: {
    //             from: 'users',
    //             as: 'user',
    //             localField: 'userId',
    //             foreignField: '_id'
    //           }
    //         },
    //         {
    //           $lookup: {
    //             from: 'tags',
    //             as: 'tags',
    //             localField: 'tags',
    //             foreignField: '_id'
    //           }
    //         },
    //         {
    //           $unwind: '$user', 
    //         },
    //         {
    //           $project: {
    //             'user.collections': 0,
    //             'user.identities': 0,
    //           }, 
    //         },
    //       ]
    //     }
    //   },
    // ]);
    // Get Repos by externalId
    const repos = await findByExternalIds(externalIds, true);
    if (repos.length > 0) {
      // Get SmartComments of Repos
      const repoRaw = await Promise.all(repos.map(async (repo) => {
        const { externalId = '' } = repo;
        const smartComments = await findSmartCommentsByExternalId(externalId, true, date ? {
          $gte: toDate(new Date(date.startDate)),
          $lte: toDate(endOfDay(new Date(date.endDate))),
        } : undefined);
        return {
          ...repo._doc,
          smartComments
        };
      })) || [];
      // Tally stats
      const repositories = repoRaw.map((repo) => {
        const { _id, externalId = '', name = '', createdAt, smartComments = [], repoStats = { userIds: [] } } = repo;
        const totalSmartComments = smartComments.length || 0;
        const totalSmartCommenters = _.uniqBy(smartComments, (item) => item.userId?.valueOf() || 0).length || 0;
        const totalPullRequests = _.uniqBy(smartComments, 'githubMetadata.pull_number').length || 0;
        const totalSemaUsers = _.get(repoStats, 'userIds', []).length || 0;
        const data = {
          stats: {
            totalSmartComments,
            totalSmartCommenters,
            totalPullRequests,
            totalSemaUsers,
          },
          _id,
          externalId,
          name,
          createdAt,
          users: repoStats.userIds,
        };
        if (includeSmartComments) {
          data.smartcomments = smartComments;
        }
        return data;
      })
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
    let condition = {
      "$and": []
    };
    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    let dateDuration = differenceInCalendarDays(to, from);
    if (dateFrom) {
      condition['$and'].push({ "$gt": ["$$el.createdAt", from] })
    }
    if (dateTo) {
      condition['$and'].push({ "$lt": ["$$el.createdAt", to] })
    }
    const repositories = await Repositories.aggregate([
      { $match: { externalId, } },
      {
        "$project": {
          "externalId": 1, "name": 1,
          "repoStats": {
            "$map": {
              "input": {
                "$filter": {
                  "input": "$repoStats.reactions",
                  "as": "el",
                  // "cond": { 
                  //   "$and": [ { "$gt": ["$$el.createdAt", from ] }, { "$lt": ["$$el.createdAt", to ] } ] 
                  // },
                  "cond": condition
                }
              },
              "as": "item",
              "in": "$$item"
            }
          }
        }
      },
    ]);
    const repo = repositories[0];
    let reactions = await getReactionIdKeys();

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
      repo.repoStats.map((stat) => {
        const reaction = stat.reactionId
        const dataDate = new Date(stat.createdAt);
        const formattedDataDate = format(dataDate, 'MM/dd/yyyy');
        if (formattedDataDate === formattedToDate) {
          if (localReactions?.[reaction]) {
            localReactions[reaction] += 1;
          } else {
            localReactions[reaction] = 1
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
    let condition = {
      "$and": []
    };
    const from = new Date(dateFrom);
    const to = new Date(dateTo);

    if (dateFrom) {
      condition['$and'].push({ "$gt": ["$$el.createdAt", from] })
    }
    if (dateTo) {
      condition['$and'].push({ "$lt": ["$$el.createdAt", to] })
    }
    const repositories = await Repositories.aggregate([
      { $match: { externalId, } },
      {
        "$project": {
          "externalId": 1, "name": 1,
          "repoStats": {
            "$map": {
              "input": {
                "$filter": {
                  "input": "$repoStats.tags",
                  "as": "el",
                  // "cond": { 
                  //   "$and": [ { "$gt": ["$$el.createdAt", from ] }, { "$lt": ["$$el.createdAt", to ] } ] 
                  // },
                  "cond": condition
                }
              },
              "as": "item",
              "in": "$$item"
            }
          }
        }
      },
    ]);
    const repo = repositories[0];
    const tags = {

    }

    repo.repoStats.map((stat) => {
      const tagsId = stat.tagsId;
      const dataDate = new Date(stat.createdAt);
      const formattedDataDate = format(dataDate, 'MM/dd/yy');
      tagsId?.map((tag) => {
        if (tags?.[tag]) {
          tags[tag].total += 1;
          const index = _.findIndex(tags[tag].tally, function (o) {
            return o.date === formattedDataDate
          });
          if (index === -1) {
            tags[tag].tally.push({
              date: formattedDataDate,
              tags: 1,
            });
          } else {
            tags[tag].tally[index].tags++;
          }
        } else {
          tags[tag] = {
            total: 1,
            tally: [
              {
                date: formattedDataDate,
                tags: 1,
              }
            ],
          };
        }
      })
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
    const users = await Users.find({ 'identities.repositories': { $elemMatch: { id: externalId } } }).exec();
    return users;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};