import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version, orgDomain } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import intercom from '../../shared/apiIntercom';
import { sendEmail } from '../../shared/emailService';

import {
  bulkAdmitUsers,
  listUsers,
  updateUserAvailableInvitesCount,
  updateUserStatus,
  getFilterMetrics,
  getTimeToValueMetric,
  exportTimeToValueMetric,
  findUser,
  exportUsers,
} from './userService';

import { checkIfInvited, deleteInvitation } from '../../invitations/invitationService';
import { revokeInvitation, patch as updateUser } from '../../users/userService';
import checkEnv from '../../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/admin/users`, route);

  route.get('/', async (req, res) => {
    try {
      const {
        page = 1, perPage = 10, search, status, listAll = false,
      } = req.query;

      const { users, totalCount } = await listUsers({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        search,
        status,
      }, listAll);
      const filterData = await getFilterMetrics();

      return res.status(200).json({
        users,
        totalCount,
        page,
        filters: filterData,
      });
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });

  route.post('/export', async (req, res) => {
    try {
      const packer = await exportUsers(req.body);
      res.writeHead(200, {
        'Content-disposition': 'attachment;filename=users.csv',
      });

      return res.end(packer);
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });

  route.get('/time-to-value', async (req, res) => {
    try {
      const { range, page = 1, perPage = 10 } = req.query;
      const { metric, totalCount } = await getTimeToValueMetric({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        range,
      });

      return res.json({ metric, totalCount });
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });

  route.post('/time-to-value/export', async (req, res) => {
    try {
      const packer = await exportTimeToValueMetric(req.body);
      res.writeHead(200, {
        'Content-disposition': 'attachment;filename=metric.csv',
      });

      return res.end(packer);
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });

  route.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const user = await findUser(id);

      return res.status(200).json(user);
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });

  route.post('/:id/invitations', async (req, res) => {
    try {
      const { id } = req.params;

      await updateUserAvailableInvitesCount(id, req.body);

      return res.status(200).json();
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });

  route.patch('/:id', async (req, res) => {
    try {
      const {
        params: { id },
        body,
      } = req;

      const { user } = await updateUser(id, body);

      return res.status(200).json(user);
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });

  route.put('/:id/status', async (req, res) => {
    try {
      const {
        params: { id },
        body,
      } = req;

      const { user } = await updateUserStatus(id, body);

      const { key, value } = body;

      if (key === 'isWaitlist' && value === false) {
        const { username } = user;
        const invitations = await checkIfInvited(username);
        invitations.forEach(async (invitation) => {
          await deleteInvitation(invitation._id);
          if(invitation.sender) {
            await revokeInvitation(invitation.senderEmail);
          }
        });

        // Add user to Intercom
        const { firstName, lastName, avatarUrl } = user;
        await intercom.create('contacts', {
          role: 'user',
          external_id: id,
          name: `${firstName} ${lastName}`.trim(),
          email: username,
          avatar: avatarUrl,
          signed_up_at: new Date(),
        });
        return res.status(200).json();
      }

      return res.status(200).json();
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });

  route.post('/bulk-admit', async (req, res) => {
    try {
      const { bulkCount } = req.body;

      await bulkAdmitUsers(bulkCount);

      return res.status(200).json();
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });

  // Swagger route
  app.use(`/${version}/admin/users-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
