import { Router } from 'express';
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import path from "path";

import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';

import { findById, validateLogin } from '../users/userService';
import { validateRefreshToken, setRefreshToken, createRefreshToken, createAuthToken } from './authService';
import { getTokenData } from '../shared/utils';
import checkEnv from "../middlewares/checkEnv";

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
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

      const refreshPayload = await validateRefreshToken(refreshToken);
      const { _id, isVerified } = refreshPayload;

      if (!_id) {
        throw new errors.BadRequest('No user ID found');
      }

      const user = await findById(_id);

      if (!user?._id) {
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

  // Swagger route
  app.use(`/${version}/auth-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
