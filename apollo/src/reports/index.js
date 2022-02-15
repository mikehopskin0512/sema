import { Router } from 'express';

import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

import logger from '../shared/logger';
import errors from '../shared/errors';
import { buildModeReportUri, generatePdf, fetchModePdf, getModeSpace } from './reportsService';
import { version, modeReportId } from '../config';
import { delay } from '../shared/utils';
import checkEnv from '../middlewares/checkEnv';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/reports`, passport.authenticate('bearer', { session: false }), route);

  route.get('/:id', async (req, res) => {
    const { id: reportId = modeReportId } = req.params;
    const { orgId, urlParams } = req.query;

    try {
      const requestUri = await buildModeReportUri(reportId, orgId, urlParams);

      if (!requestUri) {
        throw new errors.NotFound('Fetch Mode report error');
      }

      return res.status(201).send({
        requestUri,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Requests PDF generation from Mode
  route.get('/:id/pdf', async (req, res) => {
    const { id: reportToken } = req.params;
    logger.info('Generating Mode pdf...');

    try {
      // Add delay to avoid 'pending' state from Mode
      await delay(3000);
      const payload = await generatePdf(reportToken);
      return res.status(200).send(payload);
    } catch (err) {
      const { err: { status, statusText } } = err;
      logger.error('Error generating Mode PDF...');
      return res.status(status).send(statusText);
    }
  });

  // Fetches the PDF from Mode that was created above
  route.get('/:id/export/:token/pdf', async (req, res) => {
    logger.info('Retrieving Mode pdf...');
    const { id: reportToken, token: mostRecentReportRunToken } = req.params;

    try {
      const modePdf = await fetchModePdf(reportToken, mostRecentReportRunToken);

      if (!modePdf) {
        throw new errors.NotFound('Error fetching PDF from Mode');
      }

      logger.info('PDF downloaded');
      res.setHeader('Content-Type', 'application/pdf');
      return res.send(Buffer.concat(modePdf));
    } catch (err) {
      logger.error('Error getting PDF from Mode...');
      const { response: { status, data } } = err;
      return res.status(status).send(data.message);
    }
  });

  // Fetches list of reports from a space
  route.get('/space/:id', async (req, res) => {
    logger.info('Retrieving reports list from Mode...');
    const { id: spaceToken } = req.params;

    try {
      const reports = await getModeSpace(spaceToken);

      if (!reports) {
        throw new errors.NotFound('Error retrieving reports from Mode space');
      }

      logger.info('Sending reports list to client...');
      return res.status(200).send(reports);
    } catch (err) {
      logger.error('Error getting reports list...');
      if (err.response) {
        const { response: { status, data } } = err;
        return res.status(status).send(data.message);
      }
    }
  });

  // Swagger route

  app.use(`/${version}/reports-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
