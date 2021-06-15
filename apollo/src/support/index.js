import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import { sendEmail } from '../shared/emailService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/support`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { email, title, type, message, receiveCopy = false } = req.body;

    try {
        // Send to Admin"
        const recipient = 
            type === "Feedback" ? "feedback@semasoftware.com" : "support@semasoftware.com";
        const data = {
            recipient,
            templateName: 'feedbackSupportAdmin',
            sender: {
                name: `${email} via Sema`,
                email: "info@semasoftware.com"
            },
            email,
            title,
            type,
            message
        };
        await sendEmail(data);

        // Send to user
        if (receiveCopy) {
            const senderEmail = 
                type === "Feedback" ? "feedback@semasoftware.com" : "support@semasoftware.com";
            const data = {
                recipient: email,
                templateName: 'feedbackSupportUser',
                sender: {
                    name: `Sema Software Support`,
                    email: senderEmail
                },
                email,
                title,
                type,
                message
            };
            await sendEmail(data);
        }

        return res.status(201).send(data);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
