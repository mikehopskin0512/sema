import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';

import {
  createMany, findByOrg, sendNotification, findByExternalIds, findByExternalId, aggregateReactions, aggregateTags, getSemaUsersOfRepo, aggregateRepositories
} from './repositoryService';
import { getPullRequestsByExternalId, getSmartCommentersByExternalId, getSmartCommentsByExternalId } from '../comments/smartComments/smartCommentService';

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

  route.get('/search/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id: repoId } = req.params;
    try {
      const repository = await findByExternalId(repoId);
      if (!repository) { throw new errors.NotFound('No repository found'); }

      return res.status(201).send({
        repository,
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

  route.get('/sema-repositories', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { externalIds } = req.query;
    try {
      const repositories = await findByExternalIds(JSON.parse(externalIds));
      return res.status(201).send({
        repositories,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/dashboard', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { externalIds } = req.query;
    try {
      const repositories = await aggregateRepositories(JSON.parse(externalIds));
      return res.status(201).send({
        repositories,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/reactions', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { externalId, dateFrom, dateTo } = req.query;
    try {
      const reactions = await aggregateReactions(externalId, dateFrom, dateTo);
      return res.status(201).send({
        reactions,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/tags', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
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
  });

  route.get('/overview', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { externalId, startDate, endDate } = req.query;
    try {
      let dateRange = undefined;
      if (startDate && endDate) {
        dateRange = { startDate, endDate };
      }
      const repositories = await aggregateRepositories([externalId], true, dateRange);
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
  });
};
