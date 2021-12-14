import { Router } from 'express';
import { semaCorporateTeamId, version } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import { createMany, findByAuthor, findById, getUserCollectionsById, toggleActiveCollection, update } from './collectionService';
import Team from "../../teams/teamModel";
import { populateCollectionsToUsers } from "../../users/userService";

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments/collections`, route);

  route.put('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { body: { collection }, params: { id }, user: { _id } } = req;
    try {
      let payload;
      if (collection) {
        payload = await update({_id: id, ...collection});
      } else {
        payload = await toggleActiveCollection(_id, id);
        if (payload.status == 400) {
          return res.status('400').send(payload);
        }
      }

      return res.status(200).send(payload);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/all', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { user: { _id } } = req;
    try {
      const collections = await getUserCollectionsById(_id);
      return res.status(200).send(collections);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { collections, team } = req.body;
    const { _id: userId } = req.user;

    try {
      const newCollections = await createMany(collections, userId);
      if (!newCollections) {
        throw new errors.BadRequest('Collections create error');
      }

      const collectionIds = newCollections.map((col) => col._id);
      if (team == semaCorporateTeamId) {
        await populateCollectionsToUsers(collectionIds);
      } else {
        await populateCollectionsToUsers(collectionIds, userId);
      }

      return res.status(201).send({
        collections: newCollections
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
      const collection = await findById(id);
      return res.status(200).send(collection);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
      const collections = await findByAuthor(author);
      if (!collections) {
        throw new errors.BadRequest('Collections find by author error');
      }

      return res.status(201).send({
        collections
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
      const collections = await findByAuthor(author);
      if (!collections) {
        throw new errors.BadRequest('Collections find by author error');
      }

      return res.status(201).send({
        collections
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
