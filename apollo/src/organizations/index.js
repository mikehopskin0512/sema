import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import { orgDomain, version } from '../config';
import checkAccess from '../middlewares/checkAccess';
import multer from '../multer';
import { getRoleByName } from '../roles/roleService';
import { sendEmail } from '../shared/emailService';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { _checkPermission, fullName } from '../shared/utils';
import {
  addOrganizationMembers,
  createOrganization, getOrganizationById,
  getOrganizationByUrl, getOrganizationMembers, getOrganizationMetrics,
  getOrganizationRepos,
  getOrganizationsByUser, getOrganizationTotalMetrics, ROLE_NAMES,
  updateOrganization,
  updateOrganizationAvatar,
  updateOrganizationRepos,
} from '../organizations/organizationService';
import UserRole from '../userRoles/userRoleModel';
import { findByUsername } from '../users/userService';
import { create, findBySlug, sendNotification } from './organizationService';
import checkEnv from '../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/organizations`, route);

  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { _id } = req.user;
      const organizations = await getOrganizationsByUser(_id);

      return res.status(200).send(organizations);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/check-url/:url', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { url } = req.params;
      const organization = await getOrganizationByUrl(url.toLowerCase());
      return res.status(200).send({ isAvailable: !organization });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { _id } = req.user;
      const { members, url } = req.body;

      if (url) {
        const organization = await getOrganizationByUrl(url.toLowerCase());
        if (organization) {
          return res.status(400).send({
            message: 'this url is already allocated',
          });
        }
      }

      const organization = await createOrganization({
        ...req.body,
        createdBy: _id,
      });

      if (members?.length) {
        await addOrganizationMembers(organization._id, req.body.members, 'member');
      }

      return res.status(200).send(organization);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.put('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { user } = req;
    try {
      const { action, ...organizationData } = req.body;
      if (action === 'toggleOrganizationCollection') {
        // This is toggle option
        if (!(_checkPermission(organizationData._id, 'canEditCollections', user))) {
          throw new errors.Unauthorized('User does not have permission');
        }
      }
      const organization = await updateOrganization(organizationData);
      return res.status(200).send(organization);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/:organizationId/upload', passport.authenticate(['bearer'], { session: false }), multer.single('avatar'), async (req, res) => {
    try {
      const { organizationId } = req.params;
      const { _id: userId } = req.user;

      const userRole = await updateOrganizationAvatar(organizationId, userId, req.file);

      return res.status(200).send(userRole);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:organizationId/repositories', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { organizationId } = req.params;
      const { searchParams = '' } = req.query;
      const repos = await getOrganizationRepos(organizationId, { searchQuery: searchParams });
      return res.status(200).send(repos);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.put('/:organizationId/repositories', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { organizationId } = req.params;
      const { repos } = req.body;
      const organization = await updateOrganizationRepos(organizationId, repos);
      return res.status(200).send(organization);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:organizationId/metrics', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { organizationId } = req.params;
      const metrics = await getOrganizationMetrics(organizationId);
      const totalMetrics = await getOrganizationTotalMetrics(organizationId);
      return res.status(200).send({ metrics, totalMetrics });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get(
    '/:organizationId/members',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      try {
        const { organizationId } = req.params;
        const { page = 1, perPage = 10 } = req.query;

        const { members, totalCount } = await getOrganizationMembers(organizationId, {
          page: parseInt(page, 10),
          perPage: parseInt(perPage, 10),
        });

        return res.status(200).send({ members, totalCount });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    },
  );

  route.post(
    '/:organizationId/invite/validate-emails',
    passport.authenticate(['bearer'], { session: false }),
    checkAccess('canEditUsers'),
    async (req, res) => {
      try {
        const { organizationId } = req.params;
        const { users } = req.body;

        const result = await Promise.all(users.map(async (email) => {
          const semaUser = await findByUsername(email);
          // blocked status
          if (semaUser && !semaUser.isActive) {
            return {
              email,
              reason: 'blocked'
            };
          }

          if (semaUser) {
            const isOrganizationMember = await UserRole.exists({ organization: organizationId, user: semaUser._id });
            // already organization member
            if (isOrganizationMember) {
              return {
                email,
                reason: 'existing'
              };
            }
          }

          return null;
        }));

        return res.status(200).send({ invalidEmails: result.filter(item => !!item) });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    });

  route.post(
    '/:organizationId/invite',
    passport.authenticate(['bearer'], { session: false }),
    checkAccess('canEditUsers'),
    async (req, res) => {
      try {
        const { organizationId } = req.params;
        const { users, role } = req.body;

        const organization = await getOrganizationById(organizationId);

        const result = await Promise.all(users.map(async (email) => {
          let templateName = 'inviteNewUserToOrganization';
          const semaUser = await findByUsername(email);

          // blocked status
          if (semaUser && !semaUser.isActive) {
            return {
              email,
              reason: 'blocked',
            };
          }

          if (semaUser) {
            const isOrganizationMember = await UserRole.exists({ organization: organizationId, user: semaUser._id });

            // already organization member
            if (isOrganizationMember) {
              return {
                email,
                reason: 'existing',
              };
            }

            if (semaUser.isActive && !isOrganizationMember) {
              templateName = 'inviteExistingUserToOrganization';
            }
          }

          const newInvitation = await create({
            recipient: email,
            senderName: fullName(req.user),
            senderEmail: req.user.username,
            sender: req.user._id,
            organization: organizationId,
            role,
          });

          const {
            recipient, token, orgName, senderName, senderEmail,
          } = newInvitation;

          const message = {
            recipient,
            url: `${orgDomain}/login?token=${token}&organization=${organizationId}`,
            templateName,
            orgName,
            organizationName: organization?.name,
            fullName: senderName,
            email: senderEmail,
            sender: {
              name: `${senderName} via Sema`,
              email: 'invites@semasoftware.io',
            },
          };

          const result = await sendEmail(message);
          if (!result?.status) {
            return {
              email,
              reason: 'invalid',
            };
          }

          return null;
        }));

        return res.status(200).send({ invalidEmails: result.filter(item => !!item) });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    },
  );

  route.get(
    '/invite/:organizationId',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      try {
        const { user } = req;
        if (!user) {
          return res.status(404).send({ message: 'User not found'});
        }
        const { username } = user;
        const { organizationId } = req.params;
        const { _id: role } = await getRoleByName(ROLE_NAMES.MEMBER)
        const result = await addOrganizationMembers(organizationId, [username], role);
        return res.status(200).send(result);
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    },
  );


  // Swagger route
  app.use(`/${version}/organizations-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
