import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import { getAllEngGuides, create, findBySlug } from './engGuideService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments/eng-guides`, route);

  route.get('/', passport.authenticate(['basic', 'bearer'], { session: false }), async (req, res) => {
    try {
      const engGuides = await getAllEngGuides();
      return res.status(200).send(engGuides);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { engGuide } = req.body;

    try {
      const { slug } = engGuide;
      const guide = await findBySlug(slug);
      if (guide) {
        return res.status(401).end('Slug has already been used.');
      }
      const newEngGuide = await create(engGuide);
      if (!newEngGuide) {
        throw new errors.BadRequest('Engineering Guide create error');
      }
      return res.status(201).send({
        engGuide: newEngGuide,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
