import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import { create, findTagsByType, getAllTags, deleteTag } from './tagService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments/tags`, route);

  route.get('/all', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const tags = await getAllTags();
      return res.status(200).send(tags);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/suggested-comment', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const tags = await findTagsByType();
      return res.status(200).send(tags);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { body } = req;
    try {
      const tags = await create(body);
      return res.status(200).send(tags);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.delete('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
      const tag = await deleteTag(id);
      return res.status(200).send(tag);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
