import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';

import {listUsers, updateUserAvailableInvitesCount, updateUserStatus} from './userService';

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
      const { id } = req.params;

      await updateUserStatus(id, req.body);

      return res.status(200).json();
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });
};
