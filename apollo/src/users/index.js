import { Router } from 'express';
import { version, orgDomain } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import {
  create, update, findByUsername, findById,
  verifyUser, resetVerification,
  joinOrg,
  initiatePasswordReset, validatePasswordReset, resetPassword,
} from './userService';
import { setRefreshToken, createRefreshToken, createAuthToken } from '../auth/authService';
import { redeemInvite } from '../invitations/invitationService';
import { sendEmail } from '../shared/emailService';

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
      if (existingUser) { throw new errors.BadRequest('User with this email already exisits. Please try again.'); }
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }

    try {
      let newUser = await create(user);
      if (!newUser) {
        throw new errors.BadRequest('User create error');
      }

      // If invitation, call joinOrg function
      let hasInvite = false;
      if (Object.prototype.hasOwnProperty.call(invitation, '_id')) {
        hasInvite = true;
        const { _id: userId } = newUser;
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
      }

      // Send verification email
      const message = {
        recipient: newUser.username,
        url: `${orgDomain}/login?token=${newUser.verificationToken}&invite=${hasInvite}`,
        templateName: 'verifyUser',
        firstName: newUser.firstName,
      };
      await sendEmail(message);

      delete newUser.password;
      return res.status(201).send({
        jwtToken: await createAuthToken(newUser),
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Update user
  route.put('/:id', passport.authenticate(['basic', 'bearer'], { session: false }), async (req, res) => {
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
      await setRefreshToken(res, await createRefreshToken(user));

      if (!user) {
        throw new errors.BadRequest('Verification error');
      }

      // Send verification email
      const message = {
        recipient: user.username,
        templateName: 'userConfirm',
        firstName: user.firstName,
      };
      await sendEmail(message);

      return res.status(200).send({
        response: 'User successfully verified',
        jwtToken: await createAuthToken(user),
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
        url: `${orgDomain}/login?token=${user.verificationToken}`,
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
};
