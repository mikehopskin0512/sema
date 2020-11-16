import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';

import {
  create, find, findByOrg, fetchRepositoriesGithub,
} from './sourceService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/sources`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { source } = req.body;

    try {
      const newSource = await create(source);
      if (!newSource) {
        throw new errors.BadRequest('Source create error');
      }

      return res.status(201).send({
        source: newSource,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { orgId } = req.query;

    try {
      const sources = await findByOrg(orgId);
      if (!sources) { throw new errors.NotFound('No sources found for this organization'); }

      return res.status(201).send({
        sources,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:sourceId/repositories', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { sourceId } = req.params;

    try {
      const source = await find(sourceId);
      const { externalSourceId, type } = source;

      let repositories = [];
      if (type === 'github') {
        repositories = await fetchRepositoriesGithub(externalSourceId);
      }

      if (!repositories) { throw new errors.NotFound('No repositories found for this source'); }

      return res.status(201).send({
        repositories,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
