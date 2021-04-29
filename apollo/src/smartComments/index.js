import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { create } from './smartCommentService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/smart-comments`, route);

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
