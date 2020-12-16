import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';

import {
  create, findByProject, createRun,
  fetchGithubToken, updateProjectWithCreds,
  sendNotification,
} from './analysisService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/analysis`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { repositoryId, legacyId, externalSourceId } = req.body;

    try {
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
};
