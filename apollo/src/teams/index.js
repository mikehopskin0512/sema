import { Router } from 'express';
import HTTPStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version, orgDomain } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import {
  createTeam, getTeamById,
  getTeamMembers,
  addTeamMembers,
  getTeamMetrics,
  getTeamTotalMetrics,
  getTeamRepos,
  getTeamsByUser,
  updateTeam,
  updateTeamRepos,
  ROLE_NAMES,
  getTeamByUrl,
  updateTeamAvatar,
} from './teamService';
import checkAccess from '../middlewares/checkAccess';
import { getRoleByName } from '../roles/roleService';
import { _checkPermission, fullName } from '../shared/utils';
import checkEnv from '../middlewares/checkEnv';
import { findByUsername } from '../users/userService';
import UserRole from '../userRoles/userRoleModel';
import { create } from '../invitations/invitationService';
import { sendEmail } from '../shared/emailService';
import multer from '../multer';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/teams`, route);

  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { _id } = req.user;
      const teams = await getTeamsByUser(_id);
      return res.status(200).send(teams);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/check-url/:url', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { url } = req.params;
      const team = await getTeamByUrl(url.toLowerCase());
      return res.status(200).send({ isAvailable: !team });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { _id } = req.user;
    const { members, url, hasMagicLink = true } = req.body;
    try {
      if (url) {
        const team = await getTeamByUrl(url.toLowerCase());
        if (team) {
          return res
            .status(HTTPStatus.BAD_REQUEST)
            .send({ message: 'this url is already allocated' });
        }
      }
      const team = await createTeam({
        ...req.body,
        createdBy: _id,
      });
      if (hasMagicLink) {
        await create({
          senderId: _id,
          isMagicLink: true,
          teamId: team._id,
        })
      }
      if (members?.length) {
        await addTeamMembers(team._id, req.body.members, 'member');
      }

      return res.status(200).send(team);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.put('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { user } = req;
    try {
      const { action, ...teamData } = req.body;
      if (action === 'toggleTeamCollection') {
        // This is toggle option
        if (!(_checkPermission(teamData._id, 'canEditCollections', user))) {
          throw new errors.Unauthorized('User does not have permission');
        }
      }
      const team = await updateTeam(teamData);
      return res.status(200).send(team);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/:teamId/upload', passport.authenticate(['bearer'], { session: false }), multer.single('avatar'), async (req, res) => {
    try {
      const { teamId } = req.params;
      const { _id: userId } = req.user;

      const userRole = await updateTeamAvatar(teamId, userId, req.file);

      return res.status(200).send(userRole);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:teamId/repositories', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { teamId } = req.params;
      const { searchParams = '' } = req.query;
      const repos = await getTeamRepos(teamId, { searchQuery: searchParams });
      return res.status(200).send(repos);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.put('/:teamId/repositories', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { teamId } = req.params;
      const { repos } = req.body;
      const team = await updateTeamRepos(teamId, repos);
      return res.status(200).send(team);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/:teamId/metrics', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { teamId } = req.params;
      const metrics = await getTeamMetrics(teamId);
      const totalMetrics = await getTeamTotalMetrics(teamId);
      return res.status(200).send({ metrics, totalMetrics });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get(
    '/:teamId/members',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      try {
        const { teamId } = req.params;
        const { page = 1, perPage = 10 } = req.query;

        const { members, totalCount } = await getTeamMembers(teamId, {
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
    '/:teamId/invite/validate-emails',
    passport.authenticate(['bearer'], { session: false }),
    checkAccess('canEditUsers'),
    async (req, res) => {
    try {
      const { teamId } = req.params;
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
          const isTeamMember = await UserRole.exists({ team: teamId, user: semaUser._id });
          // already team member
          if (isTeamMember) {
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
    '/:teamId/invite',
    passport.authenticate(['bearer'], { session: false }),
    checkAccess('canEditUsers'),
    async (req, res) => {
      try {
        const { teamId } = req.params;
        const { users, role } = req.body;

        const team = await getTeamById(teamId);

        const result = await Promise.all(users.map(async (email) => {
          let templateName = 'inviteNewUserToTeam';
          const semaUser = await findByUsername(email);

          // blocked status
          if (semaUser && !semaUser.isActive) {
            return {
              email,
              reason: 'blocked',
            };
          }

          if (semaUser) {
            const isTeamMember = await UserRole.exists({ team: teamId, user: semaUser._id });

            // already team member
            if (isTeamMember) {
              return {
                email,
                reason: 'existing',
              };
            }

            if (semaUser.isActive && !isTeamMember) {
              templateName = 'inviteExistingUserToTeam';
            }
          }

          const newInvitation = await create({
            recipient: email,
            senderName: fullName(req.user),
            senderEmail: req.user.username,
            senderId: req.user._id,
            teamId,
            roleId: role,
          });

          const {
            recipient, token, orgName, senderName, senderEmail,
          } = newInvitation;

          const message = {
            recipient,
            url: `${orgDomain}/login?token=${token}&team=${teamId}`,
            templateName,
            orgName,
            teamName: team?.name,
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
    '/invite/:teamId',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      try {
        const { user } = req;
        if (!user) {
          return res.status(404).send({ message: 'User not found'});
        }
        const { username } = user;
        const { teamId } = req.params;
        const { _id: role } = await getRoleByName(ROLE_NAMES.MEMBER)
        const result = await addTeamMembers(teamId, [username], role);
        return res.status(200).send(result);
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    },
  );

  // Swagger route
  app.use(`/${version}/teams-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
