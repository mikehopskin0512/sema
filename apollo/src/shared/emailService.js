// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from '@sendgrid/mail';
import { sendgrid } from '../config';
import logger from './logger';
// import errors from './errors';

const { apiKey, defaultSender } = sendgrid;
sgMail.setApiKey(apiKey);

const templates = {
  passwordResetRequest: 'd-5bede979644f44408a2372ed53557150',
  passwordResetConfirm: 'd-cd1ef124f7a54430b723f9b85e626fb9',
  inviteUser: 'd-9d3edff986234a619a4681fb3e1dfb80',
  userConfirm: 'd-07e2e2aca47b411a9165885ecb7acdb3',
  verifyUser: 'd-ceb1757425874fd9af621484e1e29321',
};

export const sendEmail = async (messageData) => {
  const {
    templateName, sender = defaultSender, recipient,
    firstName = '', fullName = '', orgName = '', url = '',
  } = messageData;

  const msg = {
    templateId: templates[templateName],
    from: sender,
    to: recipient,
    dynamic_template_data: {
      firstName,
      fullName,
      orgName,
      url,
    },
  };

  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      logger.error(error);

      if (error.response) {
        logger.error(error.response.body);
      }
    }
  })();
};

export const somethingElse = '';
