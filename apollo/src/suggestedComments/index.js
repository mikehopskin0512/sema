import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import { searchComments } from './suggestedCommentService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/suggested-comments`, route);

  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const searchQuery = req.query.q;
    try {
      const topResult = await searchComments(searchQuery);
      return res.status(201).send({ searchResults: topResult });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
