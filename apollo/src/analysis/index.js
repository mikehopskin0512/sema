import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import { version } from '../config';

import logger from '../shared/logger';
import errors from '../shared/errors';

import { findByProject, createRun, updateProjectWithCreds } from '../shared/scqp';
import { fetchGithubToken } from '../identity/github/utils';
import { create, sendNotification } from './analysisService';
import { get as getRepository } from '../repositories/repositoryService';
import checkEnv from '../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/analysis`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { repositoryId, externalSourceId } = req.body;
    let { legacyId } = req.body;

    try {
      // Check for legacyId or fetch if missing
      if (!legacyId) {
        ({ legacyId } = getRepository(repositoryId));
        if (!legacyId) {
          throw new errors.BadRequest('Unable to fetch legacyId. Analysis aborted.');
        }
      }

      // Check if run is in progress
      const existingRuns = await findByProject(legacyId);
      if (existingRuns && existingRuns.length > 0) {
        throw new errors.BadRequest('Job is already running for this repository');
      }

      // Create new run in SCCP
      const newRun = await createRun(legacyId);
      // Get new run Id from newRun
      const { id: runId } = newRun;

      // Fetch GitHub token
      const token = await fetchGithubToken(externalSourceId);
      if (!token) {
        throw new errors.BadRequest('Unable to fetch token');
      }

      // Update product in SCCP with Github credentials
      await updateProjectWithCreds(legacyId, token);

      // Store analysis in Apollo
      const newAnalysis = await create(repositoryId, runId);

      await sendNotification(legacyId, runId);

      return res.status(201).send({
        source: newAnalysis,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(`/${version}/analysis-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
