import { Router } from 'express';
import { groupBy } from 'lodash';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import moment from 'moment';
import {
  findByRepositoryId,
  getCollaborativeSmartComments,
} from '../comments/smartComments/smartCommentService';

import { version } from '../config';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { findUsersByGitHubHandle } from '../users/userService';
import {
  searchSmartComments,
} from '../comments/smartComments/smartCommentService';

import {
  aggregateReactions,
  aggregateRepositories,
  aggregateTags,
  createMany,
  findByExternalId,
  findByExternalIds,
  findByOrg,
  getReposFilterValues,
  getRepositories,
  getRepository,
  sendNotification,
  startSync,
} from './repositoryService';
import checkEnv from '../middlewares/checkEnv';
import validateToken from '../middlewares/validateToken';
import { endOfDay, toDate } from 'date-fns';
import mongoose from 'mongoose';
import { getReactionTagsChartData, setSmartCommentsDateRange } from '../comments/smartComments/parcing';

const {
  Types: { ObjectId },
} = mongoose;

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
const route = Router();

export default (app, passport) => {
  app.use(`/${version}/repositories`, route);

  route.post(
    '/',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { repositories } = req.body;

      try {
        const newRepositories = await createMany(repositories);
        if (!newRepositories) {
          throw new errors.BadRequest('Repositories create error');
        }

        await sendNotification(newRepositories);

        return res.status(201).send({
          repositories: newRepositories,
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get('/search/:id', validateToken(), async (req, res) => {
    const { id: repoId } = req.params;
    try {
      const repository = await findByExternalId(repoId);
      if (!repository) {
        throw new errors.NotFound('No repository found');
      }

      return res.status(201).send({
        repository,
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  route.get(
    '/',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { orgId, Ids } = req.query;
      const idsArray = Ids?.split('-');

      try {
        const repositories = Ids
          ? await getRepositories({ ids: idsArray })
          : await findByOrg(orgId);
        if (!repositories) {
          throw new errors.NotFound(
            Ids
              ? 'No repositories found'
              : 'No repositories found for this organization'
          );
        }

        return res.status(201).send({
          repositories,
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get(
    '/sema-repositories',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalIds } = req.query;
      try {
        const repositories = await findByExternalIds({
          externalIds: JSON.parse(externalIds),
        });
        return res.status(201).send({
          repositories,
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get(
    '/dashboard',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalIds = '[]', searchQuery } = req.query;
      try {
        const repositories = await aggregateRepositories({
          externalIds: externalIds ? JSON.parse(externalIds) : [],
          searchQuery,
        });
        return res.status(201).send({
          repositories,
        });
      } catch (error) {
        logger.error(error);
        return res.status(error?.statusCode || 500).send(error);
      }
    }
  );

  route.get(
    '/reactions',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalId, dateFrom, dateTo } = req.query;
      try {
        const reactions = await aggregateReactions(
          externalId,
          dateFrom,
          dateTo
        );
        return res.status(201).send({
          reactions,
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    });

  route.post(
    '/smart-comments/search',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const {
        repoIds,
        orgId,
        startDate,
        endDate,
        fromUserList,
        toUserList,
        summaries,
        tags,
        pullRequests,
        searchQuery,
        pageNumber = 1,
        pageSize = 10,
        requester: author,
        reviewer
      } = req.body;

      let dateRange = undefined;
      if (startDate && endDate) {
        dateRange = { startDate, endDate };
      }
      if (!repoIds && !orgId) {
        return res.status(401).send({
          message: 'Repo ID is required.'
        })
      }

      try {
        const { smartComments, total} = await searchSmartComments({
          repoIds,
          dateRange,
          fromUserList,
          toUserList,
          summaries,
          tags,
          pullRequests,
          searchQuery,
          pageNumber,
          pageSize,
          reviewer,
          author,
          orgId,
        });

        const totalPage = Math.ceil(total/pageSize);
        return res.status(201).send({
          paginationData: {
            pageSize,
            pageNumber: pageNumber > totalPage ? 1 : pageNumber,
            totalPage,
            total,
            hasNextPage: pageNumber < totalPage,
            hasPreviousPage: 1 < pageNumber
          },
          smartComments
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get(
    '/tags',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalId, dateFrom, dateTo } = req.query;
      try {
        const tags = await aggregateTags(externalId, dateFrom, dateTo);
        return res.status(201).send({
          tags,
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get(
    '/overview',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalId, startDate, endDate } = req.query;
      try {
        let dateRange;
        if (startDate && endDate) {
          dateRange = { startDate, endDate };
        }
        const repositories = await aggregateRepositories(
          { externalIds: [externalId] },
          true,
          dateRange
        );
        if (repositories.length > 0) {
          return res.status(200).send(repositories[0]);
        }
        return res.status(404).send({
          message: 'Not found',
        });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get(
    '/charts',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const {
        repoId,
        startDate,
        endDate,
        requesters,
        receivers,
        search,
        tags,
        reactions,
        pullRequests,
      } = req.query;

      const makeQuery = () => {
        const query = {};
        if (reactions?.length) {
          query.reaction  = { $in: reactions.map(r => ObjectId(r))}
        }

        if (tags?.length) {
          query.tags =  { $in: tags.map(t => ObjectId(t)) }
        }

        if (requesters?.length) {
          query.userId = { $in:  requesters.map(r => ObjectId(r)) }
        }

        if (receivers?.length) {
          query['githubMetadata.requester'] = { $in: receivers } ;
        }

        if (pullRequests?.length) {
          query['githubMetadata.pull_number'] = { $in: pullRequests };
        }

        if (search?.length) {
          const searchRegEx = new RegExp(search, 'ig');
          query.comment = { $regex: searchRegEx };
        }

        return query;
      }

      try {
        const comments = await findByRepositoryId(
          repoId,
          true,
          startDate && endDate ? {
            $gte: toDate(new Date(startDate)),
            $lte: toDate(endOfDay(new Date(endDate))),
          } : undefined,
          makeQuery()
        );

        const {
          groupBy,
          dateDiff,
          endDay,
          startDay,
        } = setSmartCommentsDateRange(comments, startDate ? moment(startDate) : null, endDate ? moment(endDate) : null);

        const { reactionsChartData, tagsChartData } = getReactionTagsChartData({
          startDate: startDay,
          endDate: endDay,
          groupBy,
          smartComments: comments,
          dateDiff,
        });

        return res.status(200)
          .send({
            reactions: reactionsChartData,
            tags: tagsChartData,
            groupBy,
            dateDiff,
            endDay,
            startDay,
          });


      } catch (err) {
        logger.error(err);
        return res.status(err.statusCode).send(err);
      }
    }
  )

  route.post(
    '/:id/sync',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { id } = req.params;
      const repository = await getRepository(id);
      await startSync({ repository, user: req.user });
      res.sendStatus(200);
    }
  );

  route.get(
    '/filter-values',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      try {
        const { externalIds, startDate, endDate, filterFields } = req.query;
        const filter = await getReposFilterValues(
          JSON.parse(externalIds),
          startDate,
          endDate,
          { ...JSON.parse(filterFields) }
        );
        return res.send({ filter });
      } catch (error) {
        logger.error(error);
        return res.status(error.statusCode).send(error);
      }
    }
  );

  route.get('/collaboration/:handle/:repoId', async (req, res) => {
    try {
      const { repoId, handle } = req.params;
      const repo = await findByExternalId(repoId);
      const { givenComments, receivedComments } =
        await getCollaborativeSmartComments({ repoId: repo._id, handle });
      const totalInteractionsCount =
        receivedComments.length + givenComments.length;
      const requesters = groupBy(givenComments, 'githubMetadata.requester');
      const commentators = groupBy(
        receivedComments,
        'githubMetadata.user.login'
      );
      const users = await findUsersByGitHubHandle([
        ...Object.keys(commentators),
        ...Object.keys(requesters),
        handle,
      ]);
      const avatarsByUsers = new Map(
        users.map((user) => [user.identities[0].username, user])
      );
      const interactionsByUsers = {};
      // TODO: could be done more accurate
      Object.keys(commentators).forEach((key) => {
        interactionsByUsers[key] = {
          name: key,
          count: commentators[key].length,
          avatarUrl: avatarsByUsers.get(key)?.identities[0].avatarUrl,
        };
      });
      Object.keys(requesters).forEach((key) => {
        interactionsByUsers[key] = {
          name: key,
          count:
            requesters[key].length + (interactionsByUsers[key]?.count || 0),
          avatarUrl: avatarsByUsers.get(key)?.identities[0].avatarUrl,
        };
      });
      return res.status(201).send({
        repoName: repo.fullName,
        user: {
          name: handle,
          avatarUrl: avatarsByUsers.get(handle)?.avatarUrl,
        },
        totalInteractionsCount,
        interactionsByUsers: Object.values(interactionsByUsers),
      });
    } catch (error) {
      logger.error(error);
      return res.status(error.statusCode).send(error);
    }
  });

  // Swagger route
  app.use(
    `/${version}/repositories-docs`,
    checkEnv(),
    swaggerUi.serveFiles(swaggerDocument, {}),
    swaggerUi.setup(swaggerDocument)
  );
};
