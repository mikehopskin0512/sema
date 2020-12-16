import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';

import {
  create, find,
  sendNotification,
} from './analysisService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/analysis`, route);

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
      await sendNotification(legacyId, runId);

      return res.status(201).send({
        sources,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

};
