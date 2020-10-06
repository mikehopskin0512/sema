import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import {
  create, findBySlug,
  selectRepositoriesByOrg, selectContributors, selectFileTypesByOrg,
} from './organizationService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/organizations`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { ...org } = req.body;
    // Placeholder code for find existing org step
    // const { slug } = org;

/*    try {
      const existingOrg = await findBySlug(slug);
      if (existingOrg) { throw new errors.BadRequest('Organization with this url already exisits. Please try again.'); }
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    } */

    try {
      const newOrg = await create(org);
      if (!newOrg) {
        throw new errors.BadRequest('Org create error');
      }

      return res.status(201).send({
        organization: newOrg,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:id/repositories', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { id: orgId } = req.params;
      const repositories = await selectRepositoriesByOrg(orgId);
      if (!repositories) {
        throw new errors.BadRequest('Error fetching repositories');
      }

      return res.status(201).send(repositories);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:id/contributors', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { id: orgId } = req.params;
      const contributors = await selectContributors(orgId);
      if (!contributors) {
        throw new errors.BadRequest('Error fetching contributors');
      }

      return res.status(201).send(contributors);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:id/fileTypes', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { id: orgId } = req.params;
      const fileTypes = await selectFileTypesByOrg(orgId);
      if (!fileTypes) {
        throw new errors.BadRequest('Error fetching file types');
      }

      return res.status(201).send(fileTypes);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
