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
import { checkAndSendEmail as sendWelcomeEmail } from '../shared/utils';
import { getSnapshotsByUserId } from '../snapshots/snapshotService';
import {
  create,
  update,
  patch,
  findById,
  verifyUser,
  resetVerification,
  joinOrg,
  initiatePasswordReset,
  validatePasswordReset,
  resetPassword,
  updatePreviewImgLink,
  findByHandle,
  toggleUserRepoPinned,
} from './userService';
import {
  setRefreshToken,
  createRefreshToken,
  createAuthToken,
} from '../auth/authService';
import { syncUser } from '../identity/github/utils';
import {
  redeemInvite,
  checkIsInvitationValid,
} from '../invitations/invitationService';
import { sendEmail } from '../shared/emailService';
import { getPortfoliosByUser } from '../portfolios/portfolioService';
import checkEnv from '../middlewares/checkEnv';
import multer from '../multer';
import { uploadImage } from '../utils';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/users`, route);

  // Fetch user
  route.get(
    '/:id',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
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
    }
  );

  // Create user
  route.post(
    '/',
    passport.authenticate(['basic'], { session: false }),
    async (req, res) => {
      const { user, invitation } = req.body;
      const { username } = user;

      try {
        const newUser = await create(user, invitation?.token);
        if (!newUser) {
          throw new errors.BadRequest('User create error');
        }

        await Promise.all([
          redeemInviteIfNeeded(newUser, invitation),
          addUserToMailchimp(newUser),
          addUserToIntercom(newUser),
          sendWelcomeEmail(newUser),
          syncUser({
            user: newUser,
            token: user.identities[0].accessToken,
          }),
        ]);

        return res.status(201).send({
          jwtToken: await createAuthToken(newUser),
          user: {
            ...newUser.toJSON(),
            password: undefined,
            collections: undefined,
          },
        });
      } catch (error) {
        logger.error(error);
        return res.status(400).send(error);
      }
    }
  );

  // Update user
  route.put(
    '/:id',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
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
    }
  );

  // Patch user
  route.patch(
    '/:id',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
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
    }
  );

  // Join org
  route.post(
    '/:id/organizations',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
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
    }
  );

  // Verify token
  route.get(
    '/verification/:token',
    passport.authenticate(['basic'], { session: false }),
    async (req, res) => {
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
    }
  );

  route.post(
    '/verification',
    passport.authenticate(['basic'], { session: false }),
    async (req, res) => {
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
    }
  );

  route.post(
    '/password-reset',
    passport.authenticate(['basic'], { session: false }),
    async (req, res) => {
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
    }
  );

  route.post(
    '/password',
    passport.authenticate(['basic'], { session: false }),
    async (req, res) => {
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
    }
  );

  route.get(
    '/password-reset/:token',
    passport.authenticate(['basic'], { session: false }),
    async (req, res) => {
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
    }
  );

  route.get(
    '/:id/portfolios',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { id } = req.params;
      try {
        const userPortfolios = await getPortfoliosByUser(id, true);
        return res.status(200).send(userPortfolios);
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get(
    '/:id/snapshots',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { id } = req.params;
      try {
        const snapshots = await getSnapshotsByUserId(id);
        return res.status(200).send(snapshots);
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.patch(
    '/:id/pinned-repos',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { id } = req.params;
      const { repoId } = req.body;

      try {
        await toggleUserRepoPinned(id, repoId);
        return res.status(200).send({
          success: 'ok',
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.post(
    '/infoPreview/:userId/:repoId',
    passport.authenticate(['bearer'], { session: false }),
    multer.single('previewImgLink'),
    async (req, res) => {
      try {
        const { userId, repoId } = req.params;
        const uploadedImage = await uploadImage(req.file, 'infographics');

        if (uploadedImage)
          await updatePreviewImgLink(userId, repoId, uploadedImage.Location);

        return res.status(200).send({});
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get('/infoPreview/:handle/:repoId', async (req, res) => {
    try {
      const { handle, repoId } = req.params;
      const user = await findByHandle(handle);
      const previewImgLink = user?.identities[0]?.repositories?.find(
        (repo) => repo.id === repoId
      )?.previewImgLink;
      return res.status(200).send({ previewImgLink });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(
    `/${version}/users-docs`,
    checkEnv(),
    swaggerUi.serveFiles(swaggerDocument, {}),
    swaggerUi.setup(swaggerDocument)
  );
};

// Add user to Mailchimp and subscribe it to Sema - Newsletters
async function addUserToMailchimp(user) {
  const listId = mailchimpAudiences.registeredAndWaitlistUsers || null;
  const { _id: userId, firstName, lastName, username } = user;

  if (!listId) return;

  await mailchimp.update(`lists/${listId}/members/${md5(username)}`, {
    list_id: listId,
    merge_fields: {
      SEMA_ID: userId.toString(),
      FNAME: firstName,
      LNAME: lastName,
    },
    status: 'subscribed',
    email_type: 'html',
    email_address: username,
    tags: ['Registered and Waitlist Users'],
  });
}

async function addUserToIntercom(user) {
  const { _id: userId, firstName, lastName, avatarUrl, username } = user;

  await intercom.create('contacts', {
    role: 'user',
    external_id: userId,
    name: `${firstName} ${lastName}`.trim(),
    email: username,
    avatar: avatarUrl,
    signed_up_at: new Date(),
  });
}

async function redeemInviteIfNeeded(user, invitation) {
  const shouldRedeem = invitation._id || !checkIsInvitationValid(invitation);

  if (shouldRedeem) await redeemInvite(user._id, invitation?.token);
}
