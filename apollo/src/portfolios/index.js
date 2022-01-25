import { Router } from 'express';

import { version } from '../config';
import logger from '../shared/logger';
import { create, update, deleteOne } from './portfolioService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/portfolios`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const portfolio = req.body;
    try {
      const newPortfolio = await create(portfolio);
      return res.status(201).send(newPortfolio);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.put('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    const portfolio = req.body;
    try {
      const updatedPortfolio = await update(id, portfolio);
      return res.status(200).send(updatedPortfolio);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.delete('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
      const deletedPortfolio = await deleteOne(id);
      return res.status(200).send(deletedPortfolio);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
