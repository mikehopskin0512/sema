import Source from './sourceModel';
import logger from '../shared/logger';
import errors from '../shared/errors';

export const create = async (source) => {
  try {
    const {
      orgId, type,
    } = source;

    const query = Source.findOneAndUpdate(
      { orgId, type },
      { $set: source },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    const updatedSource = await query.exec();

    return updatedSource;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const findByOrg = async (orgId) => {
  try {
    const query = Source.find({ orgId });
    const org = await query.lean().exec();

    return org;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};
