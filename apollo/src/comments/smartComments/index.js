import { Router } from 'express';
import { version } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import { create, getSOWMetrics, exportSowMetrics } from './smartCommentService';

const route = Router();

export default (app, passport) => {
  app.use(`/${version}/comments/smart`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const smartComment = req.body;
    try {
      const newSmartComment = await create(smartComment);
      if (!newSmartComment) {
        throw new errors.BadRequest('Smart Comment create error');
      }
      return res.status(201).json({ smartComment: newSmartComment });
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/metric', async (req, res) => {
    try {
      const comments = await getSOWMetrics(req.query);
      return res.json({ comments });
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/metric/export', async (req, res) => {
    try {
      const packer = await exportSowMetrics(req.body);
      res.writeHead(200, {
        'Content-disposition': 'attachment;filename=wallet.csv',
        'Content-Length': packer.length,
      });

      res.end(packer);
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
