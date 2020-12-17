import Repositories from './repositoryModel';
import logger from '../shared/logger';
import errors from '../shared/errors';
import publish from '../shared/sns';

const snsTopic = process.env.AMAZON_SNS_CROSS_REGION_TOPIC;

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
