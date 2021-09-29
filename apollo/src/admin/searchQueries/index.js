import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';

import {exportSearchQueries, getLastQueries} from './searchQueryService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/admin/search-queries`, route);

  route.get('/', async (req, res) => {
    try {
      const { page = 1, perPage = 50 } = req.query;

      const { totalCount, queries } = await getLastQueries({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
      });

      return res.status(200).json({
        totalCount,
        queries
      });
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });
  route.post('/export', async (req, res) => {
    try {
      const packer = await exportSearchQueries();

      res.writeHead(200, {
        'Content-disposition': 'attachment;filename=' + 'metric.csv',
      });

      res.end(packer);
    } catch (err) {
      const error = new errors.InternalServer(err);
      logger.error(error);
      throw error;
    }
  });
};
