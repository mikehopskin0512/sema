import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import { findById, toggleActiveCollection } from './collectionService';

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
}