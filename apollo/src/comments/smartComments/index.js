import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import { create, filterSmartComments } from './smartCommentService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments/smart`, route);

  route.post('/', async (req, res) => {
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
  
  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { requester: author, reviewer: reviewer, externalId: repoId } = req.query;

    try {
      const comments = await filterSmartComments({author, reviewer, repoId});
      return res.status(201).send({
        comments,
      });
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
