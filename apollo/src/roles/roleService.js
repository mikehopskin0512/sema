import errors from '../shared/errors';
import logger from '../shared/logger';
import Role from './roleModel';

export const getRoleByName = async (name) => {
  try {
    const role = await Role.findOne({ name });
    return role;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const roles = await Role.find();
    return roles;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    throw error;
  }
};
