import { Router } from 'express';

import { version } from '../config';
import logger from '../shared/logger';
import { create, update, deleteOne } from './snapshotService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/snapshots`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const snapshot = req.body;
    const { portfolioId = null } = req.query;
    try {
      const newSnapshot = await create(snapshot, portfolioId);
      return res.status(201).send(newSnapshot);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.put('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    const snapshot = req.body;
    try {
      const updatedSnapshot = await update(id, snapshot);
      return res.status(200).send(updatedSnapshot);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.delete('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
      const deletedSnapshot = await deleteOne(id);
      return res.status(200).send(deletedSnapshot);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
