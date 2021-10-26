import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import { getTeams, createTeam } from './teamService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/teams`, route);

  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { user: { _id } } = req.user;
      const teams = await getTeams(_id);

      return res.status(200).send(teams);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { user: { _id } } = req.user;

      const team = await createTeam({
        ...req.body,
        createdBy: _id,
      });

      return res.status(200).send(team);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
