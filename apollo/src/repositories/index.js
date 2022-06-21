import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';

import {
  createMany,
  findByOrg,
  sendNotification,
  findByExternalIds,
  findByExternalId,
  aggregateReactions,
  aggregateTags,
  aggregateRepositories,
  getRepositories,
  getRepository,
  startSync,
  toggleIsPinned,
} from './repositoryService';
import checkEnv from '../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/repositories`, route);

  route.post(
    '/',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
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
    }
  );

  route.get(
    '/search/:id',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { id: repoId } = req.params;
      try {
        const repository = await findByExternalId(repoId);
        if (!repository) {
          throw new errors.NotFound('No repository found');
        }

        return res.status(201).send({
          repository,
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get(
    '/',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { orgId, Ids } = req.query;
      const idsArray = Ids?.split('-');

      try {
        const repositories = Ids
          ? await getRepositories({ ids: idsArray })
          : await findByOrg(orgId);
        if (!repositories) {
          throw new errors.NotFound(
            Ids
              ? 'No repositories found'
              : 'No repositories found for this organization'
          );
        }

        return res.status(201).send({
          repositories,
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get(
    '/sema-repositories',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalIds } = req.query;
      try {
        const repositories = await findByExternalIds({
          externalIds: JSON.parse(externalIds),
        });
        return res.status(201).send({
          repositories,
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get(
    '/dashboard',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalIds = '[]', searchQuery } = req.query;
      try {
        const repositories = await aggregateRepositories({
          externalIds: externalIds ? JSON.parse(externalIds) : [],
          searchQuery,
        });
        return res.status(201).send({
          repositories,
        });
      } catch (error) {
        logger.error(error);
        return res.status(error?.statusCode || 500).send(error);
      }
    }
  );

  route.get(
    '/reactions',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalId, dateFrom, dateTo } = req.query;
      try {
        const reactions = await aggregateReactions(
          externalId,
          dateFrom,
          dateTo
        );
        return res.status(201).send({
          reactions,
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get(
    '/tags',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalId, dateFrom, dateTo } = req.query;
      try {
        const tags = await aggregateTags(externalId, dateFrom, dateTo);
        return res.status(201).send({
          tags,
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get(
    '/overview',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalId, startDate, endDate } = req.query;
      try {
        let dateRange;
        if (startDate && endDate) {
          dateRange = { startDate, endDate };
        }
        const repositories = await aggregateRepositories(
          { externalIds: [externalId] },
          true,
          dateRange
        );
        if (repositories.length > 0) {
          return res.status(201).send(repositories[0]);
        }
        return res.status(404).send({
          message: 'Not found',
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.post(
    '/:id/sync',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { id } = req.params;
      const repository = await getRepository(id);
      await startSync({ repository, user: req.user });
      res.sendStatus(200);
    }
  );

  route.patch('/toggleIsPinned', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.query;

    try {
      await toggleIsPinned(id);
      return res.status(200).send({
        success: 'ok',
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(
    `/${version}/repositories-docs`,
    checkEnv(),
    swaggerUi.serveFiles(swaggerDocument, {}),
    swaggerUi.setup(swaggerDocument)
  );
};
