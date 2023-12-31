import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version } from '../config';

import {
  create as createRepository,
  startSync,
} from '../repositories/repositoryService';
import checkEnv from '../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/repo-sync`, route);

  route.post(
    '/',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const repository = await createRepository({
        type: req.body.type,
        id: req.body.externalId,
      });
      await startSync({ repository, user: req.user });

      res.json({
        _id: repository._id,
      });
    }
  );

  // Swagger route
  app.use(
    `/${version}/repo-sync-docs`,
    checkEnv(),
    swaggerUi.serveFiles(swaggerDocument, {}),
    swaggerUi.setup(swaggerDocument)
  );
};
