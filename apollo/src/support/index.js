import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version, sendgrid } from '../config';
import logger from '../shared/logger';
import { sendEmail } from '../shared/emailService';
import checkEnv from '../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/support`, route);

  route.post('/', passport.authenticate(['basic', 'bearer'], { session: false }), async (req, res) => {
    const { email, title, type, message } = req.body;

    try {
      // Send to Admin
      const recipient = type === 'Feedback' ? 'feedback@semasoftware.com' : 'support@semasoftware.com';
      const data = {
        recipient,
        templateName: 'feedbackSupportAdmin',
        sender: {
          name: `${email} via Sema`,
          email: sendgrid.defaultSender,
        },
        email,
        title,
        type,
        message,
      };
      await sendEmail(data);

      // Send to user
      const senderEmail = type === 'Feedback' ? 'feedback@semasoftware.com' : 'support@semasoftware.com';
      const userData = {
        recipient: email,
        templateName: 'feedbackSupportUser',
        sender: {
          name: 'Sema Software Support',
          email: senderEmail,
        },
        email,
        title,
        type,
        message,
      };
      await sendEmail(userData);

      return res.status(201).send(data);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(`/${version}/support-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
