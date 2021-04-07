import Organization from './organizationModel';
import logger from '../shared/logger';
import errors from '../shared/errors';
import publish from '../shared/sns';

const snsTopic = process.env.AMAZON_SNS_CROSS_REGION_TOPIC;
// const snsFilter = process.env.AMAZON_SNS_ORG_REPLICATION_FILTER;

export const create = async (org) => {
  const { orgName = '', slug = '' } = org;

  try {
    const newOrg = new Organization({
      orgName,
      slug,
    });
    const savedOrg = await newOrg.save();
    return savedOrg;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const findBySlug = async (slug) => {
  try {
    const query = Organization.findOne({ slug });
    const org = await query.lean().exec();

    return org;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const sendNotification = async (org) => {
  if (!snsTopic) return false;

  const snsFilter = {
    action: {
      DataType: 'String',
      StringValue: 'createOrg',
    },
  };

  const result = await publish(snsTopic, org, snsFilter);
  return result;
};
