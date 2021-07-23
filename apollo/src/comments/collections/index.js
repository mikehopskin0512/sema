import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import { createMany, findById, toggleActiveCollection } from './collectionService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments/collections`, route);

  route.get('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
      const collections = await findById(id);
      return res.status(200).send({ collections });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
  
  route.put('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { params: { id }, user: { user: { _id }} } = req;
    try {
      const payload = await toggleActiveCollection(_id, id);
      return res.status(200).send(payload);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', async (req, res) => {
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
};
