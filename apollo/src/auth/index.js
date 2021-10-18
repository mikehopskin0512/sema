import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';

import { findById, validateLogin } from '../users/userService';
import { validateRefreshToken, setRefreshToken, createRefreshToken, createAuthToken } from './authService';
import { getTokenData } from '../shared/utils';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/auth`, passport.authenticate('basic', { session: false }), route);

  route.post('/token', async (req, res) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        throw new errors.BadRequest('Both username and password are required.');
      }

      const user = await validateLogin(username, password);
      if (!user) {
        throw new errors.NotFound('No user found');
      }

      await setRefreshToken(res, user, await createRefreshToken(user));

      return res.status(201).send({ jwtToken: await createAuthToken(user) });
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

      let refreshPayload = null;
      try {
        refreshPayload = await validateRefreshToken(refreshToken);
      } catch (error) {
        // Supressing error messages since invalid refresh token will happen often
        // logger.error(error);
        throw new errors.BadRequest('Invalid refresh token');
      }

      if (!refreshPayload.user) {
        throw new errors.BadRequest('No user object found');
      }

      const user = await findById(refreshPayload.user._id);

      if (!user) {
        throw new errors.NotFound('No user found');
      }

      const tokenData = await getTokenData(user);

      await setRefreshToken(res, tokenData, await createRefreshToken(tokenData));

      return res.status(201).send({ jwtToken: await createAuthToken(tokenData) });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
