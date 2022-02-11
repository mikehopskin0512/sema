import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version } from '../config';
import logger from '../shared/logger';
import { create, update, deleteOne, getPortfolioById } from './portfolioService';
import checkEnv from '../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/portfolios`, route);

  route.get('/:id', passport.authenticate(['basic'], { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
      const portfolio = await getPortfolioById(id);
      return res.status(201).send(portfolio);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

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

  // Swagger route
  app.use(`/${version}/portfolios-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
