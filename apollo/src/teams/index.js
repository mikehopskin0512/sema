import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import {
  getTeams,
  createTeam,
  getTeamMembers,
  addTeamMembers,
} from './teamService';
import checkAccess from '../middlewares/checkAccess';
import { semaCorporateTeamId } from '../config';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/teams`, route);

  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { _id } = req.user;
      const teams = await getTeams(_id);

      return res.status(200).send(teams);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { _id } = req.user;

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
    '/:teamId/invite',
    passport.authenticate(['bearer'], { session: false }),
    checkAccess(semaCorporateTeamId, 'canEditUsers'),
    async (req, res) => {
      try {
        const { teamId } = req.params;
        const { users, role } = req.body;

        const result = await addTeamMembers(teamId, users, role);
        return res.status(200).send(result);
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    },
  );
};
