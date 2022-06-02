import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import { version, semaCorporateOrganizationId } from '../config';
import logger from '../shared/logger';
import checkAccess from '../middlewares/checkAccess';
import { createUserRole, updateRole, deleteUserRole } from './userRoleService';
import checkEnv from '../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/user-roles`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const userRole = await createUserRole({
        ...req.body,
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
    checkAccess('canEditUsers'),
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

  // TODO: need to be refactored to get organizationId
  route.delete(
    '/:organizationId/:userRoleId',
    passport.authenticate(['bearer'], { session: false }),
    checkAccess('canEditUsers'),
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

  // Swagger route
  app.use(`/${version}/user-roles-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
