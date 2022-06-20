import { Router } from 'express';
import { format } from 'date-fns';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

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
  getSmartComments,
  filterSmartComments,
  getSuggestedMetrics,
  exportSuggestedMetrics,
  getSmartCommentsTagsReactions,
  updateByGithubId,
  deleteByGithubId,
} from './smartCommentService';
 import checkEnv from '../../middlewares/checkEnv';
import axios from 'axios';
import Organization from '../../organizations/organizationModel'
import { createOrganization } from '../../organizations/organizationService';

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export const ORGANIZATION_META_URL = 'https://api.github.com/orgs';

export default (app, passport) => {
  app.use(`/${version}/comments/smart`, route);

  route.post('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const smartComment = req.body;
    try {
      const newSmartComment = await create(smartComment);

      if (smartComment?.githubMetadata?.organization) {
        const { data: organizationMeta } = await axios.get( `${ORGANIZATION_META_URL}/${smartComment.githubMetadata.organization}`);

        const existingOrganization = await Organization.findOne({ id: organizationMeta.id });

        if (!existingOrganization) {
          await createOrganization({
            orgMeta: { ...organizationMeta },
            id: organizationMeta.id,
            name: organizationMeta.name,
          });
        }
      }

      if (!newSmartComment) {
        throw new errors.BadRequest('Smart Comment create error');
      }
      return res.status(201).json({ smartComment: newSmartComment });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { requester: author, reviewer, externalId: repoId } = req.query;
    try {
      const comments = await filterSmartComments({ author, reviewer, repoId });
      return res.status(201).send({
        comments,
      });
    } catch (error) {
      logger.error(error);
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
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/user-activities', async (req, res) => {
    try {
      const userActivities = await getUserActivityChangeMetrics();
      return res.json({ userActivities });
    } catch (error) {
      logger.error(error);
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
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/metric', async (req, res) => {
    try {
      const comments = await getSowMetrics(req.query);
      return res.json({ comments });
    } catch (error) {
      logger.error(error);
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
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/growth-repository', async (req, res) => {
    try {
      const growthOfRepository = await getGrowthRepositoryMetrics();

      return res.json({ growthOfRepository });
    } catch (error) {
      logger.error(error);
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
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/suggested', async (req, res) => {
    try {
      const { page = 1, perPage = 50, search, sortDesc } = req.query;

      const { comments, totalCount } = await getSuggestedMetrics({
        page: parseInt(page, 10),
        perPage: parseInt(perPage, 10),
        search,
        sortDesc: sortDesc === 'true',
      });
      return res.json({ comments, totalCount });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.post('/suggested/export', async (req, res) => {
    try {
      const { search, sortDesc } = req.body;
      const packer = await exportSuggestedMetrics({ search, sortDesc: sortDesc === 'true' });
      res.writeHead(200, {
        'Content-disposition': `attachment;filename=suggested_comments_${format(new Date(), 'yyyyMMdd')}.csv`,
      });

      return res.end(packer);
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/summary', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const { user, organizationId = '', individual = false } = req.query;
    try {
      const fields = { _id: 1, reaction: 1, tags: 1, githubMetadata: 1, createdAt: 1, userId: 1 }
      const summary = await getSmartCommentsTagsReactions({ user, organizationId, individual, fields });
      return res.status(201).send({
        ...summary,
        smartComments: summary.smartComments.map((comment) => comment._id),
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get('/overview', passport.authenticate(['bearer'], { session: false }), async (req, res) => {
    const {
      requester: author, reviewer, externalIds, startDate, endDate, organizationId,
    } = req.query;
    try {
      const repoIds = externalIds && externalIds.split('-');
      const overview = await getSmartCommentsTagsReactions({
        author, reviewer, repoIds, startDate, endDate, organizationId,
      });
      return res.status(201).send({
        overview: {
          ...overview,
          smartComments: overview.smartComments.map((comment) => ({
            ...comment,
            // TODO: this is a fix on an endpoit level, probably we have to fix it on service level
            userId: !comment.userId ? {} : {
              _id: comment.userId._id,
              avatarUrl: comment.userId.avatarUrl,
              firstName: comment.userId.firstName,
              lastName: comment.userId.lastName,
            },
          })),
        },
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.put('/update-by-github/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const smartComment = req.body;
      const updatedSmartComment = await updateByGithubId(id, smartComment);
      if (!updatedSmartComment) {
        throw new errors.BadRequest('Smart Comment update error');
      }
      return res.status(204).json({ smartComment: updatedSmartComment });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.delete('/update-by-github/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await deleteByGithubId(id);
      return res.status(200).json({ deleted: true });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(`/${version}/comments/smart-docs`, checkEnv(), swaggerUi.serveFiles(swaggerDocument, {}), swaggerUi.setup(swaggerDocument));
};
