import errors from '../shared/errors';
import logger from '../shared/logger';
import UserRole from './userRoleModel';

export const createUserRole = async ({ user, organization, role }) => {
  try {
    return await UserRole.findOrCreate({ user, organization }, { role });
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    throw error;
  }
};

export const updateRole = async (userRoleId, data) => {
  try {
    const role = await UserRole.updateOne({ _id: userRoleId }, { ...data });
    return { role };
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    throw error;
  }
};

export const deleteUserRole = async (userRoleId) => {
  try {
    await UserRole.deleteOne({ _id: userRoleId });
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    throw error;
  }
};
