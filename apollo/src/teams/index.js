import { Router } from 'express';
import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import {
  createTeam,
  getTeamMembers,
  addTeamMembers,
  getTeamMetrics,
  getTeamRepos,
  getTeamsByUser,
  updateTeam,
  updateTeamRepos,
} from './teamService';
import checkAccess from '../middlewares/checkAccess';
import { semaCorporateTeamId } from '../config';
import { findById } from '../comments/collections/collectionService';
import { _checkPermission } from '../shared/utils';

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

  route.put('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { user } = req;
    try {
      const { action, ...teamData } = req.body
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

  route.get('/:teamId/repositories', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { teamId } = req.params;
      const repos = await getTeamRepos(teamId);
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
      return res.status(200).send(metrics);
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
    checkAccess('canEditUsers'),
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
