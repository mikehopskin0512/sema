import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { create } from './smartComments';
import { searchComments } from './suggestedComments';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments`, route);

  // route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
  route.get('/', async (req, res) => {
    const searchQuery = req.query.q;
    try {
      const topResult = await searchComments(searchQuery);
      return res.status(201).send({ searchResults: topResult });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const smartComment = req.body;
    try {
      const newSmartComment = await create(smartComment);
      if (!newSmartComment) {
        throw new errors.BadRequest('Smart Comment create error');
      }
      return res.status(201).json({ smartComment: newSmartComment });
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
