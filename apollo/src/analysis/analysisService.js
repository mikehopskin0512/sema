import Analysis from './analysisModel';

import logger from '../shared/logger';
import errors from '../shared/errors';
import publish from '../shared/sns';

const snsTopic = process.env.AMAZON_SNS_CROSS_REGION_TOPIC;

export const create = async (repositoryId, runId) => {
  try {
    const newAnalysis = new Analysis({
      repositoryId,
      runId,
    });
    const savedAnalysis = await newAnalysis.save();
    return savedAnalysis;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const sendNotification = async (legacyId, runId) => {
  if (!snsTopic) return false;

  const snsFilter = {
    action: {
      DataType: 'String',
      StringValue: 'createAnalysis',
    },
  };

  const payload = {
    projectId: legacyId,
    runId,
  };

  const result = await publish(snsTopic, payload, snsFilter);
  return result;
};
