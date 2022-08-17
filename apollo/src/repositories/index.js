import assert from 'assert';
import Router from 'express-promise-router';
import { groupBy } from 'lodash';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import moment from 'moment';
import { endOfDay, toDate } from 'date-fns';
import mongoose from 'mongoose';
import {
  findByRepositoryId,
  getCollaborativeSmartComments,
  searchSmartComments,
} from '../comments/smartComments/smartCommentService';

import { version } from '../config';
import { findUsersByGitHubHandle } from '../users/userService';
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
import {
  getReactionTagsChartData,
  setSmartCommentsDateRange,
} from '../comments/smartComments/parcing';

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

      const newRepositories = await createMany(repositories);

      await sendNotification(newRepositories);

      return res.status(201).send({
        repositories: newRepositories,
      });
    }
  );

  route.get('/search/:id', validateToken(), async (req, res) => {
    const { id: repoId } = req.params;
    const repository = await findByExternalId(repoId);
    assert(repository, 'Not found');

    return res.send({ repository });
  });

  route.get(
    '/',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { orgId, ids } = req.query;
      const idsArray = ids?.split('-');

      const repositories = ids
        ? await getRepositories({ ids: idsArray })
        : await findByOrg(orgId);

      assert(repositories, 'Not found');

      return res.send({ repositories });
    }
  );

  route.get(
    '/sema-repositories',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalIds } = req.query;
      const repositories = await findByExternalIds({
        externalIds: JSON.parse(externalIds),
      });
      return res.send({ repositories });
    }
  );

  route.get(
    '/dashboard',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalIds = '[]', searchQuery } = req.query;
      const repositories = await aggregateRepositories({
        externalIds: externalIds ? JSON.parse(externalIds) : [],
        searchQuery,
      });
      return res.send({ repositories });
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
    }
  );

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
        reviewer,
      } = req.body;

      let dateRange;
      if (startDate && endDate) {
        dateRange = { startDate, endDate };
      }
      if (!repoIds && !orgId) {
        return res.status(401).send({
          message: 'Repo ID is required.',
        });
      }

      const { smartComments, total } = await searchSmartComments({
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

      const totalPage = Math.ceil(total / pageSize);
      return res.status(201).send({
        paginationData: {
          pageSize,
          pageNumber: pageNumber > totalPage ? 1 : pageNumber,
          totalPage,
          total,
          hasNextPage: pageNumber < totalPage,
          hasPreviousPage: pageNumber > 1,
        },
        smartComments,
      });
    }
  );

  route.get(
    '/tags',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalId, dateFrom, dateTo } = req.query;
      const tags = await aggregateTags(externalId, dateFrom, dateTo);
      return res.send({ tags });
    }
  );

  route.get(
    '/overview',
    passport.authenticate(['bearer'], { session: false }),
    async (req, res) => {
      const { externalId, startDate, endDate } = req.query;
      let dateRange;
      if (startDate && endDate) {
        dateRange = { startDate, endDate };
      }
      const repositories = await aggregateRepositories(
        { externalIds: [externalId] },
        true,
        dateRange
      );
      assert(repositories.length, 'Not found');
      return res.send(repositories[0]);
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
          query.reaction = { $in: reactions.map((r) => ObjectId(r)) };
        }

        if (tags?.length) {
          query.tags = { $in: tags.map((t) => ObjectId(t)) };
        }

        if (requesters?.length) {
          query.userId = { $in: requesters.map((r) => ObjectId(r)) };
        }

        if (receivers?.length) {
          query['githubMetadata.requester'] = { $in: receivers };
        }

        if (pullRequests?.length) {
          query['githubMetadata.pull_number'] = { $in: pullRequests };
        }

        if (search?.length) {
          const searchRegEx = new RegExp(search, 'ig');
          query.comment = { $regex: searchRegEx };
        }

        return query;
      };

      const comments = await findByRepositoryId(
        repoId,
        true,
        startDate && endDate
          ? {
              $gte: toDate(new Date(startDate)),
              $lte: toDate(endOfDay(new Date(endDate))),
            }
          : undefined,
        makeQuery()
      );

      const { groupBy, dateDiff, endDay, startDay } = setSmartCommentsDateRange(
        comments,
        startDate ? moment(startDate) : null,
        endDate ? moment(endDate) : null
      );

      const { reactionsChartData, tagsChartData } = getReactionTagsChartData({
        startDate: startDay,
        endDate: endDay,
        groupBy,
        smartComments: comments,
        dateDiff,
      });

      return res.status(200).send({
        reactions: reactionsChartData,
        tags: tagsChartData,
        groupBy,
        dateDiff,
        endDay,
        startDay,
      });
    }
  );

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
      const { externalIds, startDate, endDate, filterFields } = req.query;
      const filter = await getReposFilterValues(
        JSON.parse(externalIds),
        startDate,
        endDate,
        { ...JSON.parse(filterFields) }
      );
      return res.send({ filter });
    }
  );

  route.get('/collaboration/:handle/:repoId', async (req, res) => {
    const { repoId, handle } = req.params;
    const repo = await findByExternalId(repoId);
    const { givenComments, receivedComments } =
      await getCollaborativeSmartComments({ repoId: repo._id, handle });
    const totalInteractionsCount =
      receivedComments.length + givenComments.length;
    const requesters = groupBy(givenComments, 'githubMetadata.requester');
    const commentators = groupBy(receivedComments, 'githubMetadata.user.login');
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
        count: requesters[key].length + (interactionsByUsers[key]?.count || 0),
        avatarUrl: avatarsByUsers.get(key)?.identities[0].avatarUrl,
      };
    });
    return res.send({
      repoName: repo.fullName,
      user: {
        name: handle,
        avatarUrl: avatarsByUsers.get(handle)?.avatarUrl,
      },
      totalInteractionsCount,
      interactionsByUsers: Object.values(interactionsByUsers),
    });
  });

  // Swagger route
  app.use(
    `/${version}/repositories-docs`,
    checkEnv(),
    swaggerUi.serveFiles(swaggerDocument, {}),
    swaggerUi.setup(swaggerDocument)
  );
};
