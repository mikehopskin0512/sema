import { Router } from 'express';
import { format } from 'date-fns';
import { version } from '../../config';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import {
  create,
  exportUserActivityChangeMetrics,
  getUserActivityChangeMetrics,
  getSowMetrics,
  exportSowMetrics,
  update,
  getGrowthRepositoryMetrics,
  exportGrowthRepositoryMetrics,
} from './smartCommentService';

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

  route.put('/:id', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    try {
      const { id } = req.params;
      const smartComment = req.body;
      const updatedSmartComment = await update(id, smartComment);
      if (!updatedSmartComment) {
        throw new errors.BadRequest('Smart Comment update error');
      }
      return res.status(204).json({ smartComment: updatedSmartComment });
      return updateSmartComment;
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/user-activities', async (req, res) => {
    try {
      const userActivities = await getUserActivityChangeMetrics();
      return res.json({ userActivities });
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/user-activities/export', async (req, res) => {
    try {
      const packer = await exportUserActivityChangeMetrics();
      res.writeHead(200, {
        'Content-disposition': 'attachment;filename=metric.csv',
      });

      return res.end(packer);
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/metric', async (req, res) => {
    try {
      const comments = await getSowMetrics(req.query);
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
        'Content-disposition': 'attachment;filename=share_of_wallet.csv',
      });

      return res.end(packer);
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/growth-repository', async (req, res) => {
    try {
      const growthOfRepository = await getGrowthRepositoryMetrics();

      return res.json({ growthOfRepository });
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/growth-repository/export', async (req, res) => {
    try {
      const packer = await exportGrowthRepositoryMetrics(req.body);
      res.writeHead(200, {
        'Content-disposition': `attachment;filename=growth_repository_${format(new Date(), 'yyyyMMddhhmmss')}.csv`,
      });

      return res.end(packer);
    } catch (error) {
      logger(error);
      return res.status(error.statusCode).send(error);
    }
  });
};
