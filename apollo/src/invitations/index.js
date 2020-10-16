import { Router } from 'express';
import { version, orgDomain } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { create, findByToken } from './invitationService';
import { sendEmail } from '../shared/emailService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/invitations`, route);

  // Create invitation
  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { invitation } = req.body;

    try {
      const newInvitation = await create(invitation);
      if (!newInvitation) {
        throw new errors.BadRequest('Invitation create error');
      }

      // Send invitation
      const { recipient, token, orgName, senderName } = newInvitation;
      const message = {
        recipient,
        url: `${orgDomain}/register/${token}`,
        templateName: 'inviteUser',
        orgName,
        fullName: senderName,
      };
      await sendEmail(message);

      return res.status(201).send({
        response: 'Invitation sent successfully',
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Fetch invitation
  route.get('/:token', passport.authenticate(['basic'], { session: false }), async (req, res) => {
    const { token } = req.params;

    try {
      const invitation = await findByToken(token);

      if (!invitation) {
        throw new errors.NotFound('No invitation found');
      }

      // Get variables for validation
      const { numAvailable = 1, redemptions = [], tokenExpires } = invitation;

      // Check if invitation has expired
      if (tokenExpires < Date.now()) {
        throw new errors.Forbidden(`This invitation expired on ${tokenExpires}`);
      }

      // Check redemptions against numAvailable limit
      if (redemptions.length >= numAvailable) {
        throw new errors.Forbidden('This invitation has reached it\'s invite limit');
      }

      return res.status(200).send({
        invitation,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
