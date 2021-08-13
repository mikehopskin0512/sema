import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import { getAllEngGuides } from './engGuideService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments/eng-guides`, route);

  route.get('/', passport.authenticate('basic', { session: false }), async (req, res) => {
    try {
      const engGuides = await getAllEngGuides();
      return res.status(200).send(engGuides);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
