import { version } from '../../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { selectRepositoriesByOrg, selectContributors, selectFileTypesByOrg } from './organizationService';

async function getRepositories(req, res) {
  try {
    const { id: orgId } = req.params;
    const repos = await selectRepositoriesByOrg(orgId);
    if (!repos) {
      throw new errors.BadRequest('Error fetching repositories');
    }

    return res.status(201).send({
      repos,
    });
  } catch (error) {
    logger.error(error);
    return res.status(error.statusCode).send(error);
  }
}

async function getContributors(req, res) {
  try {
    const { id: orgId } = req.params;
    const repos = await selectContributors(orgId);
    if (!repos) {
      throw new errors.BadRequest('Error fetching contributors');
    }

    return res.status(201).send({
      repos,
    });
  } catch (error) {
    logger.error(error);
    return res.status(error.statusCode).send(error);
  }
}

async function getFileTypes(req, res) {
  try {
    const { id: orgId } = req.params;
    const repos = await selectFileTypesByOrg(orgId);
    if (!repos) {
      throw new errors.BadRequest('Error fetching file types');
    }

    return res.status(201).send({
      repos,
    });
  } catch (error) {
    logger.error(error);
    return res.status(error.statusCode).send(error);
  }
}

function setup(app, passport) {
  app.get(`/${version}/organizations/:id/repositories`,
    passport.authenticate(['basic'], { session: false }),
    getRepositories);
  app.get(`/${version}/organizations/:id/contributors`,
    passport.authenticate(['basic'], { session: false }),
    getContributors);
  app.get(`/${version}/organizations/:id/fileTypes`,
    passport.authenticate(['basic'], { session: false }),
    getFileTypes);
}

module.exports = setup;
