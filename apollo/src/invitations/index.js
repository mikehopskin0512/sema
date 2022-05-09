import { Router } from 'express';
import HTTPStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import { version, orgDomain } from '../config';
import logger from '../shared/logger';
import {
  create,
  findByToken,
  getInvitationsBySender,
  getInvitationByRecipient,
  getInviteMetrics,
  exportInviteMetrics,
  redeemInvite,
  exportInvitations,
} from './invitationService';
import { createUserRole } from '../userRoles/userRoleService';
import { findByUsername, findById as findUserById, update } from '../users/userService';
import { sendEmail } from '../shared/emailService';
import { isSemaAdmin } from '../shared/utils';
import checkEnv from '../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

const sendInvitationByEmail = async ({ recipient, token, user, isUserAdmitted }) => {
  const fullName = `${user?.firstName} ${user?.lastName}`;
  const message = isUserAdmitted ? {
    recipient: recipient,
    url: `${orgDomain}/`,
    templateName: 'userAdmitted',
  } : {
    recipient,
    url: `${orgDomain}/login?token=${token}`,
    templateName: 'inviteUser',
    fullName,
    email: user?.username,
    sender: {
      name: `${fullName} via Sema`,
      email: 'invites@semasoftware.io',
    },
  };
  await sendEmail(message);
};
const checkAdminRole = (user, res) => {
  const isAdmin = isSemaAdmin(user);
  if (!isAdmin) {
    return res.status(HTTPStatus.UNAUTHORIZED).send({ message: 'Unauthorized' })
  }
};


export default (app, passport) => {
  app.use(`/${version}/invitations`, route);
  // create
  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const {
      body: { invitation },
      user,
    } = req;
    const isAdmin = isSemaAdmin(user);
    const isMagicLink = invitation.isMagicLink;
    const isPersonalInvite = !isMagicLink;
    const canCreateInvitation = user.inviteCount > 0 || isAdmin;

    if (canCreateInvitation) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .send({ message: 'User does not have enough invites.' });
    }
    if (isMagicLink && !isAdmin) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .send({ message: 'Only an admin can create a magic link' });
    }
    // TODO: I am not sure do wee need it or not
    // if (!isMagicLink) {
    //   const userInvitation = await getInvitationByRecipient(invitation.recipient);
    //   if (userInvitation) {
    //     const isInvitedByCurrentUser = userInvitation.sender.toString() === invitation.sender;
    //     const message = isInvitedByCurrentUser ?
    //       'You\'ve already invited this user. Either revoke or resend the invitation to continue.':
    //       `${invitation.recipient} has already been invited by another user.`
    //     return res.status(HTTPStatus.UNAUTHORIZED).send({ message });
    //   }
    // }
    try {
      const createdInvitation = await create(invitation);
      if (isPersonalInvite) {
        const recipient = invitation.recipient ? await findByUsername(invitation.recipient) : undefined;
        if (recipient) {
          recipient.isWaitlist = false;
          await Promise.all([
            update(recipient),
            redeemInvite(recipient._id, createdInvitation._id),
          ])
        }
        await sendInvitationByEmail({
          token: createdInvitation.token,
          recipient: recipient?.username || createdInvitation.recipient,
          user,
          isUserAdmitted: !!recipient,
        })
      }
      const updatedUser = !isAdmin && await update({ ...user, inviteCount: user.inviteCount - 1 });
      return res.status(HTTPStatus.CREATED).send({
        invitation: createdInvitation,
        user: isAdmin ? user : updatedUser,
        response: 'Invitation sent successfully',
      });
    } catch (error) {
      logger.error(error);
      return res
        .status(error.statusCode)
        .send({ message: 'Invitation create error' })
    }
  });
  // send email
  route.post('/send', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { body: { recipient } } = req;
    try {
      // TODO: should be done by ID?
      const userInvitation = await getInvitationByRecipient(recipient);
      if (!userInvitation) {
        return res
          .status(HTTPStatus.UNAUTHORIZED)
          .send({ message: `${recipient} has not been invited yet.` });
      }
      const isUserExist = Boolean(await findByUsername(recipient));
      if (isUserExist) {
        return res
          .status(HTTPStatus.UNAUTHORIZED)
          .send({ message: `${recipient} is already an active member.` });
      }
      const sender = await findUserById(userInvitation.senderId);
      await sendInvitationByEmail({
        ...userInvitation,
        user: sender,
      })
      return res
        .status(201)
        .send({ response: 'Invitation sent successfully' });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
  // redeem
  route.patch('/:token/redeem', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const {
      params: { token },
      body: { userId },
    } = req;
    try {
      // TODO: should be redeemed only by token?
      await redeemInvite(userId, null, token);
      return res
        .status(201)
        .send({ response: 'Invitation successfully redeemed' });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
  // get by token
  route.get('/:token', passport.authenticate(['basic'], { session: false }), async (req, res) => {
    const { token } = req.params;
    try {
      const invitation = await findByToken(token);
      if (!invitation) {
        return res
          .status(HTTPStatus.BAD_REQUEST)
          .send({ message: 'No invitation found' });
      }
      const { isMagicLink, redemptions = [], tokenExpires } = invitation;
      const isExpired = tokenExpires < Date.now();
      const isLimited = redemptions.length > 0 && !isMagicLink;
      if (isExpired) {
        return res
          .status(HTTPStatus.FORBIDDEN)
          .send({ message: `This invitation expired on ${tokenExpires}` });
      }
      if (isLimited) {
        return res
          .status(HTTPStatus.FORBIDDEN)
          .send({ message: 'This invitation has reached it\'s invite limit' });
      }
      return res.status(200).send({ invitation });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
  // Fetch all invitation by senderId
  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { search, page = 1, perPage = 10 } = req.query;
    const { _id: senderId } = req.user;
    try {
      const invites = await getInvitationsBySender({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        search,
        senderId,
      });
      console.log(invites);
      // const pendingInvites = await getInvitationCountByUserId(senderId, 'pending');
      // const acceptedInvites = await getInvitationCountByUserId(senderId, 'accepted');

      // TODO: it's wrong logic
      // if (invites.statusCode === 404) {
      //   if (invites.name === 'Not Found') {
      //     throw new errors.BadRequest('Invalid Sender ID');
      //   }
      //   throw new errors.NotFound('Error Encountered. Please try again');
      // }

      return res.status(200).send({
        invitations: invites,
        // TODO: fix that count
        // pendingInvites: ,
        // acceptedInvites: ,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
  // accept invitation
  route.post('/accept/:token', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const {
      params: { token },
      user,
    } = req;
    if (!token) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .send({ message: 'token is not valid'});
    }
    try {
      // TODO: check if expired / check if limited - look at 'get by token'
      const invitation = await findByToken(token);
      await Promise.all([
        createUserRole({ team: invitation.teamId, user: user._id, role: invitation.roleId }),
        redeemInvite(token, user._id, invitation._id),
      ]);
      return res.sendStatus(200);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
  route.post('/export', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    checkAdminRole(req.user, res)
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
  route.get('/metric', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    checkAdminRole(req.user, res)
    try {
      const { type, timeRange } = req.query;
      const invites = await getInviteMetrics(type, timeRange);
      return res.status(200).send({ invites });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
  route.post('/metric/export', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    checkAdminRole(req.user, res)
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
  // Swagger route
  app.use(`/${version}/invitations-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
