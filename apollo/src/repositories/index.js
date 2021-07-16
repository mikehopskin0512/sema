import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';

import {
  createMany, findByOrg, sendNotification, findByExternalId
} from './repositoryService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/repositories`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { repositories } = req.body;

    try {
      const newRepositories = await createMany(repositories);
      if (!newRepositories) {
        throw new errors.BadRequest('Repositories create error');
      }

      await sendNotification(newRepositories);

      return res.status(201).send({
        repositories: newRepositories,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { orgId } = req.query;

    try {
      const repositories = await findByOrg(orgId);
      if (!repositories) { throw new errors.NotFound('No repositories found for this organization'); }

      return res.status(201).send({
        repositories,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/sema-repositories', async (req, res) => {
    const { externalIds } = req.query;
    try {
      const repositories = await findByExternalId(JSON.parse(externalIds));
      return res.status(201).send({
        repositories,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
