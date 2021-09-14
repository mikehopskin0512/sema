import mongoose from 'mongoose';
import { Router } from 'express';
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
} from './suggestedCommentService';
import { pushCollectionComment, isEditAllowed } from '../collections/collectionService';

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

  route.get('/all-by-ids', async (req, res) => {
    try {
      const result = await getSuggestedCommentsByIds(req.query);
      return res.status(200).send(result);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', async (req, res) => {
    const { comment, source, tags, collectionId, user } = req.body;
    let { title } = req.body;
    try {

      if (!title) {
        title = comment.substring(0, 100);
      }

      const isCollectionEditable = await isEditAllowed(user, collectionId);
      if (!isCollectionEditable) {
        return res.status(422).send({
          message: 'User does not have permission to create',
        });
      }

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

  route.patch('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    const { user, collectionId } = req.body
    try {
      const isCollectionEditable = await isEditAllowed(user, collectionId);
      if (!isCollectionEditable) {
        return res.status(422).send({
          message: 'User does not have permission to edit',
        });
      }
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
      const result = await bulkCreateSuggestedComments(comments, req.user);

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
};
