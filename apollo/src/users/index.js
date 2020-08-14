import { Router } from 'express';
import { version, orgDomain } from '../../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import {
  create, update, findByUsername,
  findById, findByOrgId, verifyUser, resetVerification,
  initiatePasswordReset, validatePasswordReset, resetPassword,
} from './userService';
import { setRefreshToken, createRefreshToken, createAuthToken } from '../auth/authService';
import { sendEmail } from '../shared/emailService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/users`, route);

  route.get('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id } = req.params;

    try {
      const user = await findById(id);

      if (!user) {
        throw new errors.NotFound('No user found');
      }

      return res.status(201).send({
        user,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', passport.authenticate(['basic'], { session: false }), async (req, res) => {
    const { ...user } = req.body;
    const { username } = user;

    try {
      const existingUser = await findByUsername(username);
      if (existingUser) { throw new errors.BadRequest('User already exisits'); }
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }

    try {
      const newUser = await create(user);
      if (!newUser) {
        throw new errors.BadRequest('User create error');
      }

      // Send verification email
      const message = {
        recipient: newUser.username,
        url: `${orgDomain}/register/verify?token=${newUser.verificationToken}`,
        templateName: 'verifyUser',
        firstName: newUser.firstName,
      };
      await sendEmail(message);

      delete newUser.password;
      return res.status(201).send({
        user: newUser,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.put('/:id', passport.authenticate(['basic', 'bearer'], { session: false }), async (req, res) => {
    try {
      const user = await update(req.body.user);
      if (!user) {
        throw new errors.BadRequest('User update error');
      }

      delete user.password;
      return res.status(201).send({
        user,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { id: orgId } = req.params;

    try {
      const users = await findByOrgId(orgId);

      if (!users) {
        throw new errors.NotFound('Error fetching organization users');
      }

      return res.status(201).send({
        users,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

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
};
