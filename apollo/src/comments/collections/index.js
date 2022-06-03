import { Router } from 'express';
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import path from "path";

import { semaCorporateOrganizationId, version } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import { create, findByAuthor, findById, getUserCollectionsById, toggleActiveCollection, toggleOrganizationsActiveCollection, update } from './collectionService';
import { _checkPermission } from '../../shared/utils';
import checkEnv from "../../middlewares/checkEnv";
import { COLLECTION_TYPE } from './constants';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments/collections`, route);

  route.put('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { body: { collection, organizationId }, params: { id }, user } = req;
    const { _id } = user;
    try {
      let payload;
      if (collection) {
        if (collection?.author === 'sema') {
          if (!(_checkPermission(semaCorporateOrganizationId, 'canEditCollections', user))) {
            throw new errors.Unauthorized('User does not have permission');
          }
        }
        payload = await update({ _id: id, ...collection });
      } else {
        const collectionData = await findById(id)
        if (collectionData?.author === 'sema') {
          if (!(_checkPermission(semaCorporateOrganizationId, 'canEditCollections', user))) {
            throw new errors.Unauthorized('User does not have permission');
          }
        }
        payload = organizationId ? await toggleOrganizationsActiveCollection(organizationId, id, collectionData.type) : await toggleActiveCollection(_id, id, collectionData.type);
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
    const { user: { _id }, query: { organizationId } } = req;
    try {
      const collections = await getUserCollectionsById(_id, organizationId);
      return res.status(200).send(collections);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { collection, organizationId } = req.body;
    const { _id: userId } = req.user;

    try {
      if (!Object.values(COLLECTION_TYPE).includes(collection.type)) {
        const error = new errors.BadRequest('Wrong collection type')
        return res.status(error.statusCode).send(error);
      }

      const createdCollection = await create(collection, userId, organizationId);
      if (!createdCollection) {
        throw new errors.BadRequest('Collections create error');
      }

      return res.status(201).send({
        createdCollection
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

  // Swagger route
  app.use(`/${version}/collections-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
