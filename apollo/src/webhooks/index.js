import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import crypto from 'crypto';

import errors from '../shared/errors';
import logger from '../shared/logger';
import checkEnv from '../middlewares/checkEnv';
import { queue as githubWebhookQueue } from './githubWebhookQueue';
import { github, version } from '../config';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();
const checkSignature = () => (req, res, next) => {
  const payload = JSON.stringify(req.body);
  const signature = `sha256=${crypto
    .createHmac('sha256', github.clientSecret)
    .update(payload)
    .digest('hex')}`;

  if (signature !== req.headers['x-hub-signature-256']) {
    const error = new errors.InternalServer('Signature not match');
    return res.status(error.statusCode).send(error);
  }
  return next();
};

export default (app) => {
  app.use(`/${version}/webhooks`, checkSignature(), route);

  route.post('/github', async (req, res) => {
    try {
      if (
        [
          'pull_request_review_comment',
          'pull_request_review',
          'issue_comment',
        ].includes(req.headers['x-github-event'])
      ) {
        await githubWebhookQueue.queueJob(req.body);
        return res.status(200).send({});
      }
      return res.status(200).send({});
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(
    `/${version}/webhooks-docs`,
    checkEnv(),
    swaggerUi.serveFiles(swaggerDocument, {}),
    swaggerUi.setup(swaggerDocument)
  );
};
