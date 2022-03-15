import errors from '../shared/errors';
import logger from '../shared/logger';
import UserRole from './userRoleModel';

export const createUserRole = async (data) => {
  try {
    const existingUserRole = await findUserRole(data.user, data.team);
    if (existingUserRole) {
      throw "User has existing roles for this team.";
    }
    const userRole = new UserRole(data);
    await userRole.save();

    return userRole;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
}

export const updateRole = async (userRoleId, data) => {
  try {
    const role = await UserRole.updateOne({ _id: userRoleId }, { ...data });
    return { role };
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const deleteUserRole = async (userRoleId) => {
  try {
    await UserRole.deleteOne({ _id: userRoleId });
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findUserRole = async (userId, teamId) => {
  try {
    const condition = {};
    if (userId) {
      condition.user = userId
    }
    if (teamId) {
      condition.team = teamId
    }
    const role = await UserRole.findOne(condition)
    return role;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
}