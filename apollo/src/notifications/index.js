import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version } from '../config';
import logger from '../shared/logger';
import checkEnv from '../middlewares/checkEnv';
import {
  createNotificationToken,
  createUser
} from '../notifications/notificationService';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/notifications`, route);

  route.get(
    '/token',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      try {
        await createUser(req.user);
        const notificationsToken = await createNotificationToken(req.user._id);

        return res.status(200).send({ notificationsToken });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  // Swagger route
  app.use(
    `/${version}/notifications-docs`,
    checkEnv(),
    swaggerUi.serveFiles(swaggerDocument, {}),
    swaggerUi.setup(swaggerDocument)
  );
};
