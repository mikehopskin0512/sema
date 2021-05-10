import { Router } from 'express';
import { version, orgDomain } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { create, findByToken, getInvitationsBySender, getInvitationByRecipient } from './invitationService';
import { findByUsername } from '../users/userService';
import { sendEmail } from '../shared/emailService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/invitations`, route);

  // Create invitation
  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { invitation } = req.body;

    const user = await findByUsername(invitation.recipient);
    if (user) {
      return res.status(401).send({message: `${invitation.recipient} is already an active member.`});
    }
    const userInvitation = await getInvitationByRecipient(invitation.recipient);
    if (userInvitation) {
      if (userInvitation.sender === invitation.sender) {
        return res.status(401).send({message: 'You’ve already invited this user. Either revoke or resend the invitation to continue.'});
      }
      return res.status(401).send({message: `${invitation.recipient} has already been invited by another user.`});
    }

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

  // Fetch all invitation by senderId
  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { senderId } = req.query;

    try {
      const invites = await getInvitationsBySender(senderId);
      if (invites.statusCode === 404) {
        if (invites.name === "Not Found") {
          throw new errors.BadRequest(`Invalid Sender ID`);
        }
        throw new errors.NotFound('Error Encountered. Please try again');
      }

      return res.status(200).send({
        data: invites,
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
