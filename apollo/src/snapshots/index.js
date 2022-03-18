import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import { version } from '../config';
import { addSnapshotToPortfolio, removeSnapshotFromPortfolio } from '../portfolios/portfolioService';
import logger from '../shared/logger';
import { create, update, deleteOne } from './snapshotService';
import checkEnv from '../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/snapshots`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const snapshot = req.body;
    const { portfolioId = null, ...rest } = snapshot;
    try {
      const savedSnapshot = await create({
        ...rest,
        userId: req.user._id,
        portfolios: portfolioId ? [portfolioId] : [],
      });
      if (portfolioId) {
        await addSnapshotToPortfolio(portfolioId, savedSnapshot._id);
      }
      return res.status(201).send(savedSnapshot);
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
      await Promise.all(deletedSnapshot.portfolios.map(async (portfolioId) => {
        await removeSnapshotFromPortfolio(portfolioId, id);
      }));
      return res.status(200).send(deletedSnapshot);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(`/${version}/snapshots-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
