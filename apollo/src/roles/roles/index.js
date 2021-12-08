import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import { getRoles } from './roleService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/roles`, route);

  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const roles = await getRoles();

      return res.status(200).send(roles);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
