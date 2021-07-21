import mongoose from "mongoose";
import Repositories from './repositoryModel';
import logger from '../shared/logger';
import errors from '../shared/errors';
import publish from '../shared/sns';
import e from "express";

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

export const findByExternalIds = async (externalIds) => {
  try {
    const repositories = await Repositories.find({ 'externalId': { $in: externalIds } });
    return repositories;
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
    if (dateFrom) {
      const from = new Date(dateFrom);
      condition['$and'].push({ "$gt": ["$$el.createdAt", from] })
    }
    if (dateTo) {
      const to = new Date(dateTo);
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
    let reactions = {

    };
    const repo = repositories[0];
    repo.repoStats.map((stat) => {
      const reaction = stat.reactionId
      if (reactions?.[reaction]) {
        reactions[reaction] += 1;
      } else {
        reactions[reaction] = 1
      }
    });
    return reactions;
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
    if (dateFrom) {
      const from = new Date(dateFrom);
      condition['$and'].push({ "$gt": ["$$el.createdAt", from] })
    }
    if (dateTo) {
      const to = new Date(dateTo);
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
    let tags = {

    };
    const repo = repositories[0];
    repo.repoStats.map((stat) => {
      const tagsId = stat.tagsId;
      tagsId?.map((tag) => {
        if (tags?.[tag]) {
          tags[tag] += 1;
        } else {
          tags[tag] = 1
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