import { Router } from 'express';
import { version, orgDomain } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import {
  create, deleteInvitation, findById, findByToken, getInvitationsBySender, getInvitationByRecipient,
} from './invitationService';
import { findByUsername, update } from '../users/userService';
import { sendEmail } from '../shared/emailService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/invitations`, route);

  // Create invitation
  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const {
      body: { invitation },
      user: { user },
    } = req;

    if (invitation.inviteCount <= 0) {
      return res.status(412).send({
        message: 'User does not have enough invites.',
      });
    }

    const userRecipient = await findByUsername(invitation.recipient);
    if (userRecipient) {
      return res.status(401).send({ message: `${invitation.recipient} is already an active member.` });
    }
    const userInvitation = await getInvitationByRecipient(invitation.recipient);
    if (userInvitation) {
      if (userInvitation.sender.toString() === invitation.sender) {
        return res.status(401).send({ message: 'You’ve already invited this user. Either revoke or resend the invitation to continue.' });
      }
      return res.status(401).send({ message: `${invitation.recipient} has already been invited by another user.` });
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
      const updatedUser = await update({
        ...user,
        inviteCount: invitation.inviteCount - 1,
      });

      return res.status(201).send({
        user: updatedUser,
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
        if (invites.name === 'Not Found') {
          throw new errors.BadRequest('Invalid Sender ID');
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

  // send email
  route.post('/send', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { recipient: recipientData } = req.body;

    try {
      const userInvitation = await getInvitationByRecipient(recipientData);
      if (!userInvitation) {
        return res.status(401).send({ message: `${userInvitation.recipient} has not been invited yet.` });
      }
      const user = await findByUsername(recipientData);
      if (user) {
        return res.status(401).send({ message: `${recipientData} is already an active member.` });
      }
      // Send invitation
      const { recipient, token, orgName, senderName } = userInvitation;
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

  // Delete invitation
  route.delete('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const {
        params: { id },
        user: { user },
      } = req;

      // Find and check if invite exists and if the requester is the sender of the invitation
      const invite = await findById(id);
      if (!invite) {
        return res.status(500).send('Error finding invitation.');
      }
      if (invite.statusCode > 226) {
        return res.status(invite.statusCode).send(`Error finding invitation: ${invite.name}`);
      }
      if (!invite.sender.equals(user._id)) {
        return res.status(405).send('Unable to delete invitation: Unauthorized.');
      }

      // Delete invitation
      const response = await deleteInvitation(invite._id);
      return res.status(200).send(response);
    } catch (err) {
      logger.error(err);
      return res.status(err.statusCode).send(err);
    }
  });
};
