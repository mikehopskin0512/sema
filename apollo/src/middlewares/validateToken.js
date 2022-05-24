import { validateAuthToken } from "../auth/authService";
import { findById } from "../users/userService";
import errors from '../shared/errors';
import logger from '../shared/logger';

function validateToken() {
  return async (req, res, next) => {
    try {
      const token = req.header('authorization')
      const isBasic = token.search('Basic')
      req.user = null
      if (token && isBasic === -1) {
        const { _id: userId } = await validateAuthToken(token.slice(7));
        const user = await findById(userId);
        req.user = user
      }
    } catch (err) {
      const error = new errors.BadRequest(err);
      logger.error(error);
      throw (error);
    }
    return next();
  };
}

export default validateToken;
