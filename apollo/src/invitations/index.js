import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version, orgDomain } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { addAcceptedInviteActivity } from '../notifications/notificationService';
import {
  create,
  deleteInvitation,
  findById,
  findByToken,
  getInvitationsBySender,
  getInvitationByRecipient,
  getInviteMetrics,
  exportInviteMetrics,
  redeemInvite,
  exportInvitations,
  getInvitationCountByUserId,
  checkIfInvitedByToken
} from './invitationService';
import { createUserRole } from '../userRoles/userRoleService';
import { findByUsername, findById as findUserById, update } from '../users/userService';
import { sendEmail } from '../shared/emailService';
import { isSemaAdmin } from '../shared/utils';
import checkEnv from '../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/invitations`, route);

  // Create invitation
  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const {
      body: { invitation },
      user: userData,
    } = req;

    if (!isSemaAdmin(userData) && invitation.inviteCount <= 0) {
      return res.status(412).send({
        message: 'User does not have enough invites.',
      });
    }

    const userRecipient = await findByUsername(invitation.recipient);
    if (userRecipient) {
      userRecipient.isWaitlist = false;
      await update(userRecipient);
    }
    const userInvitation = await getInvitationByRecipient(invitation.recipient);
    if (userInvitation) {
      if (userInvitation.sender.toString() === invitation.sender) {
        return res.status(401).send({ message: 'You\'ve already invited this user. Either revoke or resend the invitation to continue.' });
      }
      return res.status(401).send({ message: `${invitation.recipient} has already been invited by another user.` });
    }

    try {
      const newInvitation = await create(invitation);
      if (!newInvitation) {
        throw new errors.BadRequest('Invitation create error');
      }

      if (userRecipient) {
        await redeemInvite(newInvitation.token, userRecipient._id);
        addAcceptedInviteActivity(userRecipient._id, userRecipient, userData._id, userData);
      } else {
        // Send invitation
        const {
          recipient, token, orgName, senderName, senderEmail,
        } = newInvitation;
        const message = {
          recipient,
          url: `${orgDomain}/login?token=${token}`,
          templateName: 'inviteUser',
          orgName,
          fullName: senderName,
          email: senderEmail,
          sender: {
            name: `${senderName} via Sema`,
            email: 'invites@semasoftware.io',
          },
        };
        await sendEmail(message);
      }

      const updatedUser = isSemaAdmin(userData) ? userData : await update({
        ...userData,
        inviteCount: invitation.inviteCount - 1,
      });

      return res.status(201).send({
        invitation: newInvitation,
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
    const { senderId, search, page = 1, perPage = 10 } = req.query;
    try {
      const invites = await getInvitationsBySender({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        search,
        senderId,
      });
      const pendingInvites = await getInvitationCountByUserId(senderId, 'pending');
      const acceptedInvites = await getInvitationCountByUserId(senderId, 'accepted');

      if (invites.statusCode === 404) {
        if (invites.name === 'Not Found') {
          throw new errors.BadRequest('Invalid Sender ID');
        }
        throw new errors.NotFound('Error Encountered. Please try again');
      }

      return res.status(200).send({
        invitations: invites,
        pendingInvites,
        acceptedInvites,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
  
  route.post('/accept/:inviteToken', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const {
        params: { inviteToken },
        user,
      } = req;
  
      const invitation = await checkIfInvitedByToken(inviteToken);
      await createUserRole({ team: invitation.team, user: user._id, role: invitation.role });
      await redeemInvite(inviteToken, user._id, invitation._id);
      return res.sendStatus(200);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/export', async (req, res) => {
    try {
      const packer = await exportInvitations(req.body);

      res.writeHead(200, {
        'Content-disposition': 'attachment;filename=' + 'invites.csv',
      });

      res.end(packer);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/metric', async (req, res) => {
    try {
      const { type, timeRange } = req.query;
      const invites = await getInviteMetrics(type, timeRange);

      return res.status(200).send({
        invites,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/metric/export', async (req, res) => {
    try {
      const { type, timeRange } = req.body;

      const packer = await exportInviteMetrics(type, timeRange);

      res.writeHead(200, {
        'Content-disposition': 'attachment;filename=' + 'metric.csv',
      });

      res.end(packer);
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

  // Send email
  route.post('/send', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { body: { recipient: recipientData } } = req;
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
      const {
        recipient, token, orgName, senderName, senderEmail,
      } = userInvitation;
      const message = {
        recipient,
        url: `${orgDomain}/login?token=${token}`,
        templateName: 'inviteUser',
        orgName,
        fullName: senderName,
        email: senderEmail,
        sender: {
          name: `${senderName} via Sema`,
          email: 'invites@semasoftware.io',
        },
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

  // Redeem invitation
  route.patch('/:token/redeem', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const {
      params: { token },
      body: { userId },
    } = req;
    try {
      const userInvitation = await redeemInvite(token, userId);
      if (!userInvitation) {
        return res.status(401).send({ message: 'Invitation redemption error' });
      }

      return res.status(201).send({
        response: 'Invitation successfully redeemed',
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
        user,
      } = req;

      // Find and check if invite exists and if the requester is the sender of the invitation
      const invite = await findById(id);
      if (!invite) {
        return res.status(500).send('Error finding invitation.');
      }
      if (invite.statusCode > 226) {
        return res.status(invite.statusCode).send(`Error finding invitation: ${invite.name}`);
      }
      if (!invite.sender.equals(user._id) && !isSemaAdmin(userData)) {
        return res.status(405).send('Unable to delete invitation: Unauthorized.');
      }

      // Delete invitation
      const response = await deleteInvitation(invite._id);
      const updatedUser = await findUserById(user._id);
      const userData = await update({
        ...user,
        inviteCount: updatedUser.inviteCount + 1,
      });
      return res.status(200).send({ user: userData, response });
    } catch (err) {
      logger.error(err);
      return res.status(err.statusCode).send(err);
    }
  });

  // Swagger route
  app.use(`/${version}/invitations-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
