import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';

import {
  createMany,
} from './collectionService';

export default (app, passport) => {
  app.use(`/${version}/collections`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { collections } = req.body;

    try {
      const newCollections = await createMany(collections);
      if (!newCollections) {
        throw new errors.BadRequest('Collections create error');
      }

      return res.status(201).send({
        collections: newCollections
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
}