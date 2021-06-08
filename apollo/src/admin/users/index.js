import { Router } from 'express';
import { version, orgDomain } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import { sendEmail } from '../../shared/emailService';

import { getAnalytics, listUsers, updateUserAvailableInvitesCount, updateUserStatus } from './userService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/admin/users`, route);

  route.get('/', async (req, res) => {
    try {
      const { page, perPage = 10, search, status } = req.query;

      const { users, totalCount } = await listUsers({ page, perPage, search, status });

      return res.status(200).json({
        users,
        totalCount,
        page,
      });
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });

  route.get('/analytic', async (req, res) => {
    try {
      const analyticData = await getAnalytics();

      return res.status(200).json(analyticData);
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

  route.put('/:id/status', async (req, res) => {
    try {
      const {
        params: { id },
        body
      } = req;

      const { user } = await updateUserStatus(id, body);

      const { key, value } = body;

      if (key === "isWaitlist" && value === false) {
        const { username } = user;
        // Send email
        const message = {
          recipient: username,
          url: `${orgDomain}/`,
          templateName: 'userAdmitted',
        };
        await sendEmail(message);
      }

      return res.status(200).json();
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });
};
