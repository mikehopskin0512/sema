import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import { bulkCreateEngGuides, getAllEngGuides, bulkUpdateEngGuides } from './engGuideService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments/eng-guides`, route);

  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const engGuides = await getAllEngGuides(req.query);
      return res.status(200).send(engGuides);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/bulk-create', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { engGuides } = req.body;
      const result = await bulkCreateEngGuides(engGuides, req.user);
      return res.status(200).send(result);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/bulk-update', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { engGuides } = req.body;
      const result = await bulkUpdateEngGuides(engGuides, req.user);
      return res.status(200).send(result);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
