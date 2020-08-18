import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';

import { findById, validateLogin } from '../users/userService';
import { validateRefreshToken, setRefreshToken, createRefreshToken, createAuthToken } from './authService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/auth`, passport.authenticate('basic', { session: false }), route);

  route.post('/token', async (req, res) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        throw new errors.BadRequest('Both username and password are required.');
      }
logger.info('login');
      const user = await validateLogin(username, password);
logger.info('login validated');
      if (!user) {
        throw new errors.NotFound('No user found');
      }
logger.info('set refresh cookie');
      await setRefreshToken(res, await createRefreshToken(user));
const authToken = await createAuthToken(user);
logger.info('authToken: ', authToken);
      return res.status(201).send({ jwtToken: authToken });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    try {
      if (!refreshToken) {
        throw new errors.BadRequest('No refresh token found.');
      }
logger.info('refresh token');
      let refreshPayload = null;
      try {
        refreshPayload = await validateRefreshToken(refreshToken);
logger.info('refresh token validated');
      } catch (error) {
        logger.error(error);
        throw new errors.BadRequest('Invalid refresh token');
      }

      if (!refreshPayload.user) {
        throw new errors.BadRequest('No user object found');
      }

      const user = await findById(refreshPayload.user._id);

      if (!user) {
        throw new errors.NotFound('No user found');
      }
logger.info('set refresh cookie');
      await setRefreshToken(res, await createRefreshToken(user));
const authToken = await createAuthToken(user);
logger.info('authToken: ', authToken);
      return res.status(201).send({ jwtToken: authToken });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
