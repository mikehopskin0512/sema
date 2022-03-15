import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version } from '../config';
import errors from '../shared/errors';
import checkEnv from '../middlewares/checkEnv';

const { create, get } = require('./credentialService');

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/credentials`, passport.authenticate('bearer', { session: false }), route);

  route.post('/', async (req, res, next) => {
    if (!req.body.name) {
      throw new errors.BadRequest('Application name must be specified in order to create api credentials.');
    }

    try {
      const payload = await create(req.user._id, req.body.name);

      if (!payload) {
        throw new errors.HTTPError('Credentials could not be created.');
      }

      return res.status(201).send({ credentials: payload });
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        throw new errors.UnprocessableEntity('Application name is already taken.');
      }
      return next(error);
    }
  });

  route.get('/', async (req, res, next) => {
    try {
      const payload = await get(req.user_id);

      if (!payload) {
        throw new errors.NotFound('Credentials not found.');
      }

      return res.status(200).send({ credentials: payload });
    } catch (error) {
      return next(error);
    }
  });

  // Swagger route
  app.use(`/${version}/credentials-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
