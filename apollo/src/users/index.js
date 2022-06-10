import md5 from 'md5';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version, orgDomain, mailchimpAudiences } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import intercom from '../shared/apiIntercom';
import mailchimp from '../shared/apiMailchimp';
import { checkAndSendEmail } from '../shared/utils';
import { getSnapshotsByUserId } from '../snapshots/snapshotService';
import {
  create, update, patch, findByUsername, findById,
  verifyUser, resetVerification,
  joinOrg,
  initiatePasswordReset, validatePasswordReset, resetPassword,
} from './userService';
import { setRefreshToken, createRefreshToken, createAuthToken } from '../auth/authService';
import { addAcceptedInviteActivity } from '../notifications/notificationService';
import { redeemInvite, checkIfInvited } from '../invitations/invitationService';
import { sendEmail } from '../shared/emailService';
import { getPortfoliosByUser } from '../portfolios/portfolioService';
import checkEnv from '../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/users`, route);

  // Fetch user
  route.get('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;

    try {
      const user = await findById(id);

      if (!user) {
        throw new errors.NotFound('No user found');
      }

      return res.status(200).send({
        user,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Create user
  route.post('/', passport.authenticate(['basic'], { session: false }), async (req, res) => {
    const { user, invitation } = req.body;
    const { username } = user;
    try {
      const existingUser = await findByUsername(username);
      if (existingUser) { throw new errors.BadRequest('User with this email already exists. Please try again.'); }
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }

    try {
      let newUser = await create(user, invitation?.token);
      newUser = newUser.toJSON();
      if (!newUser) {
        throw new errors.BadRequest('User create error');
      }
      const { _id: userId, username } = newUser;

      let inviteNotificationSent = false;
      const sendInviteNotification = async (user, recepientId) => {
        const recepient = await findById(recepientId);
        return addAcceptedInviteActivity(user._id, user, recepientId, recepient);
      }
      // If invitation, call joinOrg function
      if (Object.prototype.hasOwnProperty.call(invitation, '_id')) {
        const { orgId, orgName, sender, token } = invitation;
        // const org = { id: orgId, orgName, invitedBy: sender };
        // const invitedUser = await joinOrg(userId, org);
        // if (!invitedUser) {
        //   throw new errors.BadRequest('Org join error');
        // }

        // Update newUser with invitedUser (containing org data)
        // newUser = invitedUser;

        // Redeem invite
        await redeemInvite(token, userId);

        inviteNotificationSent = true;
        // send notification to sender - no need to await that action
        sendInviteNotification(newUser, sender).catch(logger.error);
      }

      // Check if user has been previously invited
      const [hasInvite] = await checkIfInvited(username);
      if (hasInvite) {
        const { _id: invitationId, sender } = hasInvite;
        redeemInvite(null, userId, invitationId);
        if(!inviteNotificationSent) {
          // send notification to sender - no need to await that action
          sendInviteNotification(newUser, sender).catch(logger.error);
        }
      }

      // Add user to Mailchimp and subscribe it to Sema - Newsletters
      const listId = mailchimpAudiences.registeredAndWaitlistUsers || null;
      const { firstName, lastName, avatarUrl } = newUser;

      try {
        if (listId) {
          await mailchimp.update(`lists/${listId}/members/${md5(username)}`, {
            list_id: listId,
            merge_fields: { SEMA_ID: userId.toString(), FNAME: firstName, LNAME: lastName },
            status: 'subscribed',
            email_type: 'html',
            email_address: username,
            tags: ['Registered and Waitlist Users'],
          });
        }
      } catch (error) {
        logger.error(error);
        return res.status(400).send(error);
      }

      // Add user to Intercom
      // TEMP: Comment out Intercom until variable is fixed in prod
      try {
        await intercom.create('contacts', {
          role: 'user',
          external_id: userId,
          name: `${firstName} ${lastName}`.trim(),
          email: username,
          avatar: avatarUrl,
          signed_up_at: new Date(),
        });
      } catch (error) {
        logger.error(error);
        return res.status(400).send(error);
      }

      // Check if first login then send welcome email
      await checkAndSendEmail(newUser);

      // Send verification email
      // const message = {
      //   recipient: newUser.username,
      //   url: `${orgDomain}/register/verify?token=${newUser.verificationToken}&invite=${hasInvite}`,
      //   templateName: 'verifyUser',
      //   firstName: newUser.firstName,
      // };
      // await sendEmail(message);

      delete newUser.password;
      delete newUser.collections;
      return res.status(201).send({
        jwtToken: await createAuthToken(newUser),
        user: newUser,
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).send(error);
    }
  });

  // Update user
  route.put('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const user = await update(req.body.user);
      if (!user) {
        throw new errors.BadRequest('User update error');
      }

      delete user.password;
      return res.status(200).send({
        user,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Patch user
  route.patch('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const {
      params: { id },
      body: { fields },
    } = req;
    try {
      const user = await patch(id, fields);
      if (!user) {
        throw new errors.BadRequest('User patch error');
      }

      delete user.password;
      return res.status(200).send({
        user,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Join org
  route.post('/:id/organizations', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id: userId } = req.params;
    const { org } = req.body;

    try {
      const updatedUser = await joinOrg(userId, org);
      if (!updatedUser) {
        throw new errors.BadRequest('Org join error');
      }

      return res.status(200).send({
        response: 'Org joined successfully',
        jwtToken: await createAuthToken(updatedUser),
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Verify token
  route.get('/verification/:token', passport.authenticate(['basic'], { session: false }), async (req, res) => {
    const { token } = req.params;

    try {
      const user = await verifyUser(token);

      if (!user) {
        throw new errors.BadRequest('Verification error');
      }

      await setRefreshToken(res, user, await createRefreshToken(user));

      // Send verification email
      // const message = {
      //   recipient: user.username,
      //   templateName: 'userConfirm',
      //   firstName: user.firstName,
      // };
      // await sendEmail(message);

      return res.status(200).send({
        response: 'User successfully verified',
        jwtToken: await createAuthToken(user),
        user,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/verification', passport.authenticate(['basic'], { session: false }), async (req, res) => {
    const { username } = req.body;

    try {
      const user = await resetVerification(username);

      // Send verification email
      const message = {
        recipient: user.username,
        url: `${orgDomain}/register/verify?token=${user.verificationToken}`,
        templateName: 'verifyUser',
        firstName: user.firstName,
      };
      await sendEmail(message);

      return res.status(200).send({
        response: 'Verification sent',
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/password-reset', passport.authenticate(['basic'], { session: false }), async (req, res) => {
    const { username } = req.body;

    try {
      const updatedUser = await initiatePasswordReset(username);

      const message = {
        recipient: updatedUser.username,
        url: `${orgDomain}/password-reset/${updatedUser._id}/${updatedUser.resetToken}`,
        templateName: 'passwordResetRequest',
        firstName: updatedUser.firstName,
      };
      await sendEmail(message);

      return res.status(200).send({
        response: `A password reset email has been sent to ${username}`,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/password', passport.authenticate(['basic'], { session: false }), async (req, res) => {
    const { token, password } = req.body;

    try {
      const updatedUser = await resetPassword(token, password);
      const message = {
        recipient: updatedUser.username,
        templateName: 'passwordResetConfirm',
        firstName: updatedUser.firstName,
      };
      await sendEmail(message);

      return res.status(200).send({
        response: 'Your password has been changed!',
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/password-reset/:token', passport.authenticate(['basic'], { session: false }), async (req, res) => {
    const { token } = req.params;

    try {
      const user = await validatePasswordReset(token);

      return res.status(200).send({
        user,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:id/portfolios', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
      const userPortfolios = await getPortfoliosByUser(id, true);
      return res.status(200).send(userPortfolios);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:id/snapshots', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;
    try {
      const snapshots = await getSnapshotsByUserId(id);
      return res.status(200).send(snapshots);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(`/${version}/users-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
