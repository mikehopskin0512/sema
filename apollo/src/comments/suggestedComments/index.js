import mongoose from 'mongoose';
import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import { create, searchComments, suggestCommentsInsertCount } from './suggestedCommentService';
import { pushCollectionComment } from '../collections/collectionService';

const { Types: { ObjectId } } = mongoose;

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments/suggested`, route);

  route.get('/', async (req, res) => {
    const { user = null, q: searchQuery } = req.query;
    try {
      const topResult = await searchComments(user, searchQuery);
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

  route.post('/', async (req, res) => {
    const { title, comment, source, tags, collectionId } = req.body;
    try {
      const newSuggestedComment = await create( { title, comment, source: { name: "", url: source }, tags } );
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
};
