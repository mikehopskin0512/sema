import errors from '../shared/errors';
import logger from '../shared/logger';
import Role from './roleModel';

export const getAdminRole = async () => {
  try {
    const adminRole = await Role.findOne({ name: 'Admin' });
    return adminRole;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getRoles = async () => {
  try {
    const roles = await Role.find();
    return roles;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};