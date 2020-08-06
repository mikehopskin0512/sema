// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from '@sendgrid/mail';
import { sendgrid } from '../../config';
import logger from './logger';
// import errors from './errors';

const { apiKey, defaultSender } = sendgrid;
sgMail.setApiKey(apiKey);

const templates = {
  verifyUser: 'd-ceb1757425874fd9af621484e1e29321',
  passwordResetRequest: 'd-5bede979644f44408a2372ed53557150',
  passwordResetConfirm: 'd-cd1ef124f7a54430b723f9b85e626fb9',
};

export const sendEmail = async (messageData) => {
  const {
    templateName, sender = defaultSender, recipient,
    firstName = '', url = '',
  } = messageData;

  const msg = {
    templateId: templates[templateName],
    from: sender,
    to: recipient,
    dynamic_template_data: {
      firstName,
      url,
    },
  };

  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);
      logger.error(error);

      if (error.response) {
        console.error(error.response.body);
        logger.error(error.response.body);
      }
    }
  })();
};

export const somethingElse = '';
