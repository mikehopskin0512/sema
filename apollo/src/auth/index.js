import { Router } from 'express';
import { version } from '../../config';
import logger from '../shared/logger';
import errors from '../shared/errors';

import { findById, validateLogin } from '../users/userService';
import {validateRefreshToken, setRefreshToken, createRefreshToken, createAuthToken} from './authService';

const route = Router();

export default (app, passport) => {

  app.use(`/${version}/auth`, passport.authenticate('basic', { session: false }), route);

  route.post('/token', async (req, res) => {

      const { username, password } = req.body;
      if(!username || !password) {
        throw new errors.BadRequest('Both username and password are required.');
      }

      const user = await validateLogin(username, password);
      if (!user) {
        throw new errors.NotFound('No user found');
      }

      await setRefreshToken(res, await createRefreshToken(user));

      return res.status(201).send({ jwtToken: await createAuthToken(user) });
  });

  route.post('/refresh-token', async (req, res) => {

      const { refreshToken } = req.body;

      if(!refreshToken) {
        return res.status(400).send('I got nothing');
      }

      let refreshPayload = null;
      try {
        refreshPayload = await validateRefreshToken(refreshToken);
      } catch (error) {
        logger.error(error);
        throw new errors.BadRequest('Invalid refresh token');
      }

      const user = await findById(refreshPayload.user._id);

      if (!user) {
        throw new errors.NotFound('No user found');
      }

      await setRefreshToken(res, await createRefreshToken(user));

      return res.status(201).send({ jwtToken: await createAuthToken(user) });
  });
}
