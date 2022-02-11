import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import {
  create, findSuggestedCommentTags, getAllTags, deleteTag, updateTag, getTagsById,
} from './tagService';
import checkEnv from '../../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
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
      const tags = await findSuggestedCommentTags();
      return res.status(200).send(tags);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
      const tags = await getTagsById(id);
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

  route.put('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { body, params: { id } } = req;
    try {
      const { tag } = await updateTag(id, body);
      return res.status(200).send(tag);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(`/${version}/comments/tags-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
