import { Router } from 'express';
import { version, semaCorporateTeamId } from '../config';
import logger from '../shared/logger';
import checkAccess from '../middlewares/checkAccess';
import { createUserRole, updateRole, deleteUserRole } from './userRoleService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/user-roles`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const userRole = await createUserRole({
        ...req.body
      });
      return res.status(200).send(userRole);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.patch(
    '/:userRoleId',
    passport.authenticate(['bearer'], { session: false }),
    checkAccess(semaCorporateTeamId, 'canEditUsers'),
    async (req, res) => {
      try {
        const { userRoleId } = req.params;
        const result = await updateRole(userRoleId, req.body);
        
        return res.status(200).send(result);
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    },
  );
  
  route.delete(
    '/:userRoleId',
    passport.authenticate(['bearer'], { session: false }),
    checkAccess(semaCorporateTeamId, 'canEditUsers'),
    async (req, res) => {
      try {
        const { userRoleId } = req.params;
        
        const result = await deleteUserRole(userRoleId);
        return res.status(200).send(result);
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    },
  );
};
