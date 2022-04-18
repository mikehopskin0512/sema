import { Router } from 'express';
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import path from "path";

import { version } from '../../config';
import logger from '../../shared/logger';
import {
  create,
  update,
  searchComments,
  suggestCommentsInsertCount,
  bulkCreateSuggestedComments,
  bulkUpdateSuggestedComments,
  getSuggestedCommentsByIds,
  exportSuggestedComments,
} from './suggestedCommentService';
import { pushCollectionComment, getUserCollectionsById } from '../collections/collectionService';
import checkEnv from "../../middlewares/checkEnv";
import axios from 'axios';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments/suggested`, route);

  route.get('/', async (req, res) => {
    const { user = null, team = null, q = '', allCollections = false } = req.query;
    try {
      const topResult = await searchComments(user, team, q, allCollections);
      return res.status(201).send({ searchResults: topResult });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/report', async (req, res) => {
    try {
      const { page = 1, perPage = 50 } = req.query;

      const result = await suggestCommentsInsertCount({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
      });
      return res.status(200).send(result);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/all-by-ids', async (req, res) => {
    try {
      const result = await getSuggestedCommentsByIds(req.query);
      return res.status(200).send(result);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { comment, source, tags } = req.body;
    const { _id: userId } = req.user;
    let title = req.body.title;
    let collectionId = req.body.collectionId;

    try {
      const defaultCollectionName = process.env.DEFAULT_COLLECTION_NAME || 'my comments';

      if (!collectionId) {
        const collections = await getUserCollectionsById(userId);
        // TODO: we should delete my comments later. It's a legacy name
        const defaultCollection = collections.find((collection) => {
          return collection.collectionData.name.toLowerCase() === defaultCollectionName;
        });
        collectionId = defaultCollection?.collectionData._id;
      }

      if (!title) {
        title = comment.substring(0, 100);
      }

      const newSuggestedComment = await create({
        title,
        comment,
        source: { name: '', url: source },
        tags,
        enteredBy: user._id,
        collections: [{ collectionId, name: defaultCollectionName }]
      });

      if (!newSuggestedComment) {
        throw new errors.BadRequest('Suggested Comment create error');
      }
      if (collectionId) {
        const collection = await pushCollectionComment(collectionId, newSuggestedComment._id);
        return res.status(201).send({
          suggestedComment: newSuggestedComment,
          collection: collection._id,
        });
      }
      return res.status(201).send({
        suggestedComment: newSuggestedComment
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.patch('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    const { user, collectionId } = req.body
    try {
      const suggestedComment = await update(id, req.body);
      return res.status(200).json({ suggestedComment });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/bulk-create', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { comments, collectionId } = req.body;
    try {
      const result = await bulkCreateSuggestedComments(comments, collectionId, req.user);

      if (collectionId) {
        await Promise.all(result.map(async (comment) => {
          await pushCollectionComment(collectionId, comment._id);
          return true;
        }));
      }

      return res.status(200).json(result);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/bulk-update', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { comments } = req.body;
    try {
      const result = await bulkUpdateSuggestedComments(comments);

      return res.status(200).json(result);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/export', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const packer = await exportSuggestedComments();

      return res.end(packer);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/summaries', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { data } = await axios.post( `${process.env.JAXON_SERVER_URL}/summaries`, req.body);
      return res.status(200).json(data);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/tags', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { data } = await axios.post( `${process.env.JAXON_SERVER_URL}/tags`, req.body);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(`/${version}/comments/suggested-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
