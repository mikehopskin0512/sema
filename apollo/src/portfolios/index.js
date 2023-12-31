import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version } from '../config';
import logger from '../shared/logger';
import { addPortfolioToSnapshot, removePortfolioFromSnapshot } from '../snapshots/snapshotService';
import {
  create,
  update,
  deleteOne,
  getPortfolioById,
  addSnapshotsToPortfolio,
  removeSnapshotFromPortfolio,
  updateField,
} from './portfolioService';
import checkEnv from '../middlewares/checkEnv';
import { findByHandle } from '../users/userService';
import { isEmpty } from 'lodash';
import multer from '../multer';
import validateToken from '../middlewares/validateToken';
import { uploadImage } from '../utils';

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
    if (!req.body.title) {
      return res.status(400).send({ error: 'title is required field' });
    }
    if (req.body.title.length > 130) {
      return res.status(400).send({ error: 'title is too long' });
    }
    try {
      const updatedPortfolio = await update(id, portfolio);
      return res.status(200).send(updatedPortfolio);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.delete('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id: portfolioId } = req.params;
    try {
      const deletedPortfolio = await deleteOne(portfolioId);
      await Promise.all(deletedPortfolio.snapshots.map(async (snapshot) => {
        await removePortfolioFromSnapshot(snapshot.id, portfolioId);
      }));
      return res.status(200).send({});
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.patch('/:id/title', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
      await updateField(id, 'title', title);
      return res.status(200).send({ title });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.patch('/:id/type', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;
    try {
      await updateField(id, 'type', type);
      return res.status(200).send({ result: 'ok' });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.patch('/:id/overview', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    const { overview } = req.body;
    try {
      await updateField(id, 'overview', overview);
      return res.status(200).send();
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/:id/snapshots', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { snapshots } = req.body;
    const { id: portfolioId } = req.params;
    try {
      const updatedPortfolio = await addSnapshotsToPortfolio(portfolioId, snapshots);
      await Promise.all(snapshots.map(async (snapshotId) => {
        await addPortfolioToSnapshot(snapshotId, portfolioId);
      }));
      return res.status(201).send(updatedPortfolio);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.put('/:id/snapshots', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const snapshots = req.body;
    const { id: portfolioId } = req.params;
    try {
      await Promise.all(snapshots.map(async (snapshotId) => {
        await removeSnapshotFromPortfolio(portfolioId, snapshotId);
        await removePortfolioFromSnapshot(snapshotId, portfolioId);
      }));
      return res.status(201).send({});
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:handle/portfolio/:portfolioId', validateToken(), async (req, res) => {
    const { params, user: reqUser } = req
    const { handle, portfolioId } = params;
    try {
      const user = await findByHandle(handle);
      const portfolio = await getPortfolioById(portfolioId, true);
      if (portfolio.type !== 'public' && (!reqUser || reqUser._id.toString() !== portfolio.userId.toString())) {
        return res.status(401).send({ message: `You do not have access to this portfolio`, portfolio: { isPublic: false } });
      }
      if (!isEmpty(user) && !isEmpty(portfolio) && user._id.toString() === portfolio.userId.toString()) {
        return res.status(201).send(portfolio);
      }
      return res.status(401).send({ message: `Portfolio doesn't exist for user` });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/:portfolioId/avatar', passport.authenticate(['bearer'], { session: false }), multer.single('avatar'), async (req, res) => {
    try {
      const { portfolioId } = req.params;
      const uploadedImage = await uploadImage(req.file);

      await updateField(portfolioId, 'imageUrl', uploadedImage.Location);

      return res.status(200).send({});
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(`/${version}/portfolios-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
