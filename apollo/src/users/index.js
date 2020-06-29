import { Router } from 'express';
import { version } from '../../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import {
  create, update, findByUsername,
  findById, findByOrgId,
} from './userService';

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
};
