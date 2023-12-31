import {
  format,
  formatDistanceToNowStrict,
  isAfter,
  subDays,
  subMonths,
  subWeeks,
  toDate,
  endOfDay,
} from 'date-fns';
import mongoose from 'mongoose';
import * as Json2CSV from 'json2csv';
import { _, isEmpty, uniq, uniqBy } from 'lodash';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import SmartComment from './smartCommentModel';
import Organization from '../../organizations/organizationModel';
import Repository from '../../repositories/repositoryModel';
import Reaction from '../reaction/reactionModel';
import User from '../../users/userModel';

import { dateRangeFilterPipeline, fullName, metricsStartDate } from '../../shared/utils';
import { getOrganizationRepos } from '../../organizations/organizationService';

const {
  Types: { ObjectId },
} = mongoose;
const { Parser } = Json2CSV;

// Creates smart comments from Chrome Extension.
export const create = async ({
  commentId,
  comment,
  userId,
  location,
  suggestedComments,
  reaction,
  tags,
  githubMetadata,
}) => {
  try {
    const smartComment = new SmartComment({
      commentId,
      comment,
      userId,
      location,
      suggestedComments,
      reaction,
      tags,
      githubMetadata,
      source: {
        origin: 'extension',
        provider: 'github',
      },
    });
    const savedSmartComment = await smartComment.save();
    return savedSmartComment;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const getCollaborativeSmartComments = async ({ repoId, handle }) => {
  try {
    const [givenComments, receivedComments] = await Promise.all([
      SmartComment.find({
        'repositoryId': repoId,
        'githubMetadata.user.login': handle,
        'githubMetadata.requester': { $ne: handle },
      })
        .lean()
        .exec(),
      SmartComment.find({
        'repositoryId': repoId,
        'githubMetadata.requester': handle,
        'githubMetadata.user.login': { $ne: handle },
      })
        .lean()
        .exec(),
    ]);
    return { givenComments, receivedComments };
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const filterSmartComments = async ({
  reviewer,
  author,
  repoIds,
  startDate,
  endDate,
  user,
  individual,
  fields = {},
},
  additionalQuery = {}
) => {
  try {
    let filter = {};
    let dateFilter = { source: { createdAt: {} } };
    if (repoIds) {
      filter = Object.assign(filter, {
        repositoryId: { $in: repoIds },
      });
    }
    if (reviewer) {
      filter = Object.assign(filter, { 'githubMetadata.user.login': reviewer });
    }
    if (author) {
      filter = Object.assign(filter, { 'githubMetadata.requester': author });
    }
    if (user && individual === true) {
      filter = Object.assign(filter, {
        $or: [
          { 'githubMetadata.requester': user },
          { 'githubMetadata.user.login': user },
        ],
      });
    }
    if (startDate) {
      dateFilter = Object.assign(dateFilter, {
        source: { createdAt: { $gte: new Date(startDate) } },
      });
    }
    if (endDate) {
      dateFilter = Object.assign(dateFilter, {
        source: {
          createdAt: { $lt: new Date(endDate), ...dateFilter.createdAt },
        },
      });
    }
    if (!isEmpty(dateFilter.createdAt)) {
      filter = Object.assign(filter, dateFilter);
    }

    const resultFilter = {
      ...filter,
      ...additionalQuery
    }

    const query = SmartComment.find(resultFilter, fields);
    const smartComments = await query
      .lean()
      .populate('userId')
      .populate('tags')
      .sort({ 'source.createdAt': -1 })
      .exec();

    return smartComments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const findManyById = async (smartCommentIds) => {
  try {
    return await SmartComment.find({ _id: { $in: smartCommentIds } }).exec();
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const findByReviewer = async (reviewerId) => {
  try {
    const comments = await SmartComment.find({
      'githubMetadata.user.id': reviewerId,
    });
    return comments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const findByAuthor = async (author) => {
  try {
    const comments = await SmartComment.find({
      'githubMetadata.requester': author,
    });
    return comments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const update = async (id, smartComment) => {
  try {
    const updatedSmartComment = await SmartComment.findOneAndUpdate(
      { _id: new ObjectId(id) },
      smartComment,
      { new: true }
    );
    return updatedSmartComment;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const getSowMetrics = async (params) => {
  try {
    const { category } = params;
    const reactionIds = await Reaction.distinct('_id', {
      title: { $ne: 'No reaction' },
    });

    if (category === 'comments_range') {
      const query = { createdAt: { $gte: subMonths(new Date(), 1) } };
      const totalCount = await SmartComment.countDocuments(query);
      const metricResult = [];

      await Promise.all(
        Array(Math.ceil(totalCount / 10))
          .fill(0)
          .map(async (item, index) => {
            const comments = await SmartComment.find(query)
              .sort({ 'source.createdAt': -1 })
              .skip(10 * index)
              .limit(10);
            const reactions = comments.filter(
              (comment) =>
                !!comment.reaction &&
                reactionIds
                  .map((id) => id.toString())
                  .indexOf(comment.reaction.toString()) !== -1
            ).length;
            const tags = comments.filter(
              (comment) => comment.tags && comment.tags.length
            ).length;
            const suggestedComments = comments.filter(
              (comment) =>
                comment.suggestedComments && comment.suggestedComments.length
            ).length;
            const sow = comments.filter(
              (comment) =>
                !!comment.reaction &&
                reactionIds
                  .map((id) => id.toString())
                  .indexOf(comment.reaction.toString()) !== -1 &&
                comment.tags &&
                comment.tags.length &&
                comment.suggestedComments &&
                comment.suggestedComments.length
            ).length;
            const totalTags = comments.reduce(
              (sum, comment) => sum + comment.tags.length,
              0
            );

            metricResult.push({
              _id: `${10 * index}-${
                10 * (index + 1) < totalCount ? 10 * (index + 1) : totalCount
              }`,
              index,
              reactions,
              tags,
              totalTags,
              suggestedComments,
              sow,
              total:
                10 * (index + 1) < totalCount ? 10 : totalCount - 10 * index,
            });
          })
      );

      return metricResult.sort((a, b) => a.index - b.index);
    }

    let groupField = '';

    const pipeline = [
      { $match: { createdAt: { $gt: subMonths(new Date(), 1) } } },
    ];

    if (category === 'user') {
      groupField = '$userId';
      pipeline.push({
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      });
      pipeline.push({ $unwind: '$user' });
    } else if (category === 'day') {
      groupField = {
        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
      };
    }

    const comments = await SmartComment.aggregate([
      ...pipeline,
      {
        $group: {
          _id: groupField,
          reactions: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [{ $ifNull: ['$reaction', 0] }, 0] },
                    { $in: ['$reaction', reactionIds] },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
          tags: {
            $sum: {
              $cond: {
                if: { $ne: [{ $size: { $ifNull: ['$tags', []] } }, 0] },
                then: 1,
                else: 0,
              },
            },
          },
          totalTags: {
            $sum: { $size: { $ifNull: ['$tags', []] } },
          },
          suggestedComments: {
            $sum: {
              $cond: {
                if: {
                  $ne: [{ $size: { $ifNull: ['$suggestedComments', []] } }, 0],
                },
                then: 1,
                else: 0,
              },
            },
          },
          sow: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [{ $ifNull: ['$reaction', 0] }, 0] },
                    { $in: ['$reaction', reactionIds] },
                    { $ne: [{ $size: { $ifNull: ['$tags', []] } }, 0] },
                    {
                      $ne: [
                        { $size: { $ifNull: ['$suggestedComments', []] } },
                        0,
                      ],
                    },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
          total: { $sum: 1 },
          user: { $first: '$user' },
        },
      },
      { $sort: category === 'day' ? { _id: -1 } : { total: -1 } },
    ]);

    return comments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const exportSowMetrics = async (params) => {
  const comments = await getSowMetrics(params);
  const { category } = params;

  const getGroupLabel = () => {
    if (category === 'day') return 'Date';
    if (category === 'user') return 'User';
    return 'Comments Range';
  };

  const groupLabel = getGroupLabel();
  const mappedData = comments.map((item) => ({
    [groupLabel]: category === 'user' ? fullName(item.user) : item._id,
    ...(category === 'user'
      ? {
          Email: item.user ? item.user.username : '',
        }
      : {}),
    'Reactions(%)': item.total
      ? Math.round((item.reactions / item.total) * 100)
      : 0,
    'Tags(%)': item.total ? Math.round((item.tags / item.total) * 100) : 0,
    'Suggested Comments(%)': item.total
      ? Math.round((item.suggestedComments / item.total) * 100)
      : 0,
    'All(%)': item.total ? Math.round((item.sow / item.total) * 100) : 0,
    '% of Searched Comments': item.total
      ? Math.round((item.suggestedComments / item.total) * 100)
      : 0,
    'Avg # of tags per smart comment': item.total
      ? (item.totalTags / item.total).toFixed(2)
      : 0,
    ...(category !== 'comments_range'
      ? {
          '# of smart comments': item.total,
        }
      : {}),
  }));

  const fields = [
    groupLabel,
    ...(category === 'user' ? ['Email'] : []),
    'Reactions(%)',
    'Tags(%)',
    'Suggested Comments(%)',
    'All(%)',
    '% of Searched Comments',
    'Avg # of tags per smart comment',
    ...(category !== 'comments_range' ? ['# of smart comments'] : []),
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);
  return csv;
};

export const getUserActivityChangeMetrics = async () => {
  try {
    const userActivities = await SmartComment.aggregate([
      { $match: { createdAt: { $gt: subWeeks(new Date(), 2) } } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$userId',
          activityTwoWeeksAgo: {
            $sum: {
              $cond: {
                if: { $lt: ['$createdAt', subWeeks(new Date(), 1)] },
                then: 1,
                else: 0,
              },
            },
          },
          activityOneWeekAgo: {
            $sum: {
              $cond: {
                if: { $gte: ['$createdAt', subWeeks(new Date(), 1)] },
                then: 1,
                else: 0,
              },
            },
          },
          user: { $first: '$user' },
        },
      },
    ]);
    return userActivities;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const exportUserActivityChangeMetrics = async () => {
  const userActivities = await getUserActivityChangeMetrics();
  const mappedData = userActivities.map((item) => ({
    'User': fullName(item.user),
    'Email': item.user.username,
    'Activity 2 weeks ago': item.activityTwoWeeksAgo,
    'Activity 1 week ago': item.activityOneWeekAgo,
  }));

  const fields = [
    'User',
    'Email',
    'Activity 2 weeks ago',
    'Activity 1 week ago',
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);

  return csv;
};

export const getGrowthRepositoryMetrics = async () => {
  const metrics = [];

  const startDate = await SmartComment.findOne()
    .select('createdAt')
    .sort({ createdAt: 1 });

  let daysCount = 0;

  if (startDate) {
    const distanceString = formatDistanceToNowStrict(
      new Date(startDate.createdAt),
      { unit: 'day', roundingMethod: 'ceil' }
    );
    daysCount = parseInt(distanceString.split(' ')[0], 10);
  }

  await Promise.all(
    Array(daysCount + 1)
      .fill(0)
      .map(async (item, index) => {
        const date = subDays(new Date(), index);
        const groupQuery = [
          {
            $group: {
              _id: '$userId',
              repos: { $push: '$githubMetadata.repo' },
            },
          },
        ];

        const oneDayRepos = await SmartComment.aggregate([
          {
            $match: {
              $and: [
                { createdAt: { $gt: subDays(date, 1) } },
                { createdAt: { $lte: date } },
              ],
            },
          },
          ...groupQuery,
        ]);

        const oneWeekRepos = await SmartComment.aggregate([
          {
            $match: {
              $and: [
                { createdAt: { $gt: subWeeks(date, 1) } },
                { createdAt: { $lte: date } },
              ],
            },
          },
          ...groupQuery,
        ]);

        const oneMonthRepos = await SmartComment.aggregate([
          {
            $match: {
              $and: [
                { createdAt: { $gt: subMonths(date, 1) } },
                { createdAt: { $lte: date } },
              ],
            },
          },
          ...groupQuery,
        ]);

        const registeredCount = await User.countDocuments({ isActive: true });

        const totalDayRepos = oneDayRepos.reduce(
          (sum, el) => sum + uniq(el.repos).length,
          0
        );
        const totalWeekRepos = oneWeekRepos.reduce(
          (sum, el) => sum + uniq(el.repos).length,
          0
        );
        const totalMonthRepos = oneMonthRepos.reduce(
          (sum, el) => sum + uniq(el.repos).length,
          0
        );

        metrics.push({
          date,
          oneDayRepos: oneDayRepos.length
            ? (totalDayRepos / registeredCount).toFixed(2)
            : 0,
          oneWeekRepos: oneWeekRepos.length
            ? (totalWeekRepos / registeredCount).toFixed(2)
            : 0,
          oneMonthRepos: oneMonthRepos.length
            ? (totalMonthRepos / registeredCount).toFixed(2)
            : 0,
        });
      })
  );

  metrics.sort((a, b) => (isAfter(a.date, b.date) ? -1 : 1));
  return metrics;
};

export const exportGrowthRepositoryMetrics = async () => {
  const metrics = await getGrowthRepositoryMetrics();

  const mappedData = metrics.map((item) => ({
    'Date': format(new Date(item.date), 'yyyy-MM-dd'),
    'Day 1': item.oneDayRepos,
    'Day 7': item.oneWeekRepos,
    'Day 30': item.oneMonthRepos,
  }));

  const fields = ['Date', 'Day 1', 'Day 7', 'Day 30'];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);

  return csv;
};

export const findByRepositoryId = async (repoId, populate, createdAt, additionalQuery = {}) => {
  try {
    let findQuery = {
      repositoryId: repoId,
      ...additionalQuery
    };
    if (createdAt) {
      findQuery = {
        ...findQuery,
        createdAt,
      };
    }
    const query = SmartComment.find(findQuery);
    if (populate) {
      query.populate({
        select: ['firstName', 'lastName', 'avatarUrl'],
        path: 'userId',
      });
      query.populate({ select: ['label'], path: 'tags' });
    }
    const comments = await query.sort({ 'source.createdAt': -1 }).lean();
    return comments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const searchSmartComments = async ({
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
  orgId
}) => {
  try {
    let findQuery = {}
    if (orgId) {
      if (repoIds.length) {
        findQuery = {
          ...findQuery,
          'repositoryId': { $in: repoIds }
        }
      } else {
        const organizationRepos = await getOrganizationRepos(orgId);
        findQuery = {
          ...findQuery,
          'repositoryId': { $in: organizationRepos.map((repo) => repo._id) }
        }
      }
    } else if (repoIds.length) {
      findQuery = {
        ...findQuery,
        repositoryId: { $in: repoIds }
      }
    }

    if (dateRange) {
      findQuery = {
        ...findQuery,
        'source.createdAt': {
          $gte: toDate(new Date(dateRange.startDate)),
          $lte: toDate(endOfDay(new Date(dateRange.endDate)))
        }
      };
    }

    if (reviewer) {
      findQuery = {
        ...findQuery,
        'githubMetadata.user.login': reviewer
      };
    }

    if (author) {
      findQuery = {
        ...findQuery,
        'githubMetadata.requester': author
      };
    }

    if (tags && tags.length) {
      findQuery = {
        ...findQuery,
        tags: { $in: tags }
      };
    }

    if (summaries && summaries.length) {
      findQuery = {
        ...findQuery,
        reaction: { $in: summaries }
      };
    }

    if (pullRequests && pullRequests.length) {
      findQuery = {
        ...findQuery,
        'githubMetadata.pull_number': { $in: pullRequests }
      };
    }

    if (fromUserList && fromUserList.length) {
      findQuery = {
        ...findQuery,
        userId: { $in: fromUserList }
      };
    }

    if (toUserList && toUserList.length) {
      findQuery = {
        ...findQuery,
        'githubMetadata.requester': { $in: toUserList }
      };
    }

    if (searchQuery) {
      const escapedSearchQuery = _.escapeRegExp(searchQuery);
      findQuery = {
        ...findQuery,
        comment: { $regex: new RegExp(escapedSearchQuery, 'i') }
      };
    }

    const query = SmartComment.find(findQuery);
    const countQuery = SmartComment.count(findQuery);

    query.populate({
      select: ['firstName', 'lastName', 'avatarUrl'],
      path: 'userId'
    });
    query.populate({ select: ['label'], path: 'tags' });

    query.skip((pageNumber - 1) * pageSize).limit(pageSize);
    const [smartComments, total] = await Promise.all([query.sort({ 'source.createdAt': -1 }).lean(), countQuery]);
    return {
      smartComments,
      total
    }
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const getSuggestedMetrics = async (
  { page, perPage, search, sortDesc },
  isExport = false
) => {
  const userIds = search
    ? await User.distinct('_id', {
        $or: [
          { username: RegExp(search, 'gi') },
          { firstName: RegExp(search, 'gi') },
          { lastName: RegExp(search, 'gi') },
        ],
      })
    : [];
  const reactionIds = search
    ? await Reaction.distinct('_id', {
        title: RegExp(search, 'gi'),
      })
    : [];

  const query = SmartComment.find(
    search
      ? {
          $or: [
            { comment: new RegExp(search, 'gi') },
            { 'githubMetadata.url': new RegExp(search, 'gi') },
            { 'githubMetadata.requester': new RegExp(search, 'gi') },
            { userId: { $in: userIds } },
            { reaction: { $in: reactionIds } },
          ],
        }
      : {}
  )
    .sort(sortDesc ? '-createdAt' : 'createdAt')
    .populate('userId')
    .populate('reaction');

  const totalCount = await SmartComment.countDocuments(query);

  if (!isExport) {
    query.skip((page - 1) * perPage).limit(perPage);
  }

  const smartComments = await query.exec();
  return { comments: smartComments, totalCount };
};

export const exportSuggestedMetrics = async ({ search, sortDesc }) => {
  const { comments } = await getSuggestedMetrics({ search, sortDesc }, true);
  const mappedData = comments.map((item) => ({
    'Comment': item.comment,
    'Reaction': item.reaction && item.reaction.title,
    'Tags': item.tags.length,
    'Suggested Comments': item.suggestedComments.length,
    'Date': item.createdAt
      ? format(new Date(item.createdAt), 'yyyy-MM-dd hh:mm:ss')
      : '',
    'Repo': item.githubMetadata && item.githubMetadata.url,
    'Email': item.userId && item.userId.username,
    'Author': item.githubMetadata && item.githubMetadata.requester,
    'Reviewer Email': item.userId && item.userId.username,
    'Reviewer Name': item.userId && fullName(item.userId),
  }));

  const fields = [
    'Comment',
    'Reaction',
    'Tags',
    'Suggested Comments',
    'Date',
    'Repo',
    'Email',
    'Author',
    'Reviewer Email',
    'Reviewer Name',
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);

  return csv;
};

const groupMetricsPipeline = [
  {
    $group: {
      _id: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$source.createdAt',
        },
      },
      comments: { $sum: 1 },
      pullRequests: { $addToSet: '$githubMetadata.pull_number' },
      commenters: { $addToSet: '$userId' },
    },
  },
  {
    $project: {
      _id: '$$REMOVE',
      values: {
        $arrayToObject: [
          [
            {
              k: '$_id',
              v: {
                comments: '$comments',
                pullRequests: { $size: '$pullRequests' },
                commenters: { $size: '$commenters' },
              },
            },
          ],
        ],
      },
    },
  },
  {
    $group: {
      _id: null,
      values: { $mergeObjects: '$values' },
    },
  },
  {
    $replaceRoot: {
      newRoot: '$values',
    },
  },
];

export async function getOrganizationSmartCommentsMetrics(organizationId) {
  const { repos: repositoryIds } = await Organization.findById(
    organizationId
  ).select('repos');

  const [doc] = await SmartComment.aggregate([
    {
      $match: {
        'repositoryId': { $in: repositoryIds },
        'source.createdAt': {
          $gte: metricsStartDate,
        },
      },
    },
    ...groupMetricsPipeline,
  ]);
  return doc;
}

export async function getRepoSmartCommentsMetrics(repoExternalId) {
  const { _id: repositoryId } = await Repository.findOne({
    externalId: repoExternalId,
  }).select('_id');

  const [doc] = await SmartComment.aggregate([
    {
      $match: {
        'repositoryId': repositoryId,
        'source.createdAt': {
          $gte: metricsStartDate,
        },
      },
    },
    ...groupMetricsPipeline,
  ]);
  return doc;
}

export const getSmartCommentsTagsReactions = async ({
  author,
  reviewer,
  repoIds,
  startDate,
  endDate,
  user,
  organizationId,
  individual,
  fields = {},
}) => {
  try {
    const filter = {
      reviewer,
      author,
      repoIds,
      startDate,
      endDate,
      user,
      individual:
        typeof individual === 'string' ? JSON.parse(individual) : individual,
      fields,
    };

    if (organizationId) {
      const organizationRepos = await getOrganizationRepos(organizationId);
      filter.repoIds = organizationRepos.map((repo) => repo._id);
    }

    const smartComments = await filterSmartComments(filter);
    const totalReactions = getTotalReactionsOfComments(smartComments);
    const totalTags = getTotalTagsOfComments(smartComments);
    return { smartComments, reactions: totalReactions, tags: totalTags };
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getTotalReactionsOfComments = (smartComments = []) =>
  _(smartComments)
    .filter((comment) => comment?.reaction)
    .countBy('reaction')
    .value();

export const getTotalTagsOfComments = (smartComments = []) =>
  _(smartComments).compact().flatMap('tags').countBy('_id').value();

export const getSmartCommentersCount = (smartComments = []) =>
  uniqBy(smartComments, (item) => item.userId?.valueOf() || 0).length || 0;

export const getPullRequests = (smartComments = []) =>
  uniqBy(smartComments, 'githubMetadata.pull_number').length || 0;

export const updateByGithubId = async (id, smartComment) => {
  try {
    const updatedSmartComment = await SmartComment.findOneAndUpdate(
      { 'githubMetadata.commentId': id },
      smartComment,
      { new: true }
    );
    return updatedSmartComment;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const deleteByGithubId = async (id) => {
  try {
    await SmartComment.deleteOne({ 'githubMetadata.commentId': id });
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

// This is for getting the unique userId in smartComments.
export const getUniqueCommenters = async (repoIds, startDate, endDate) => {
  try {
    const values = await SmartComment.aggregate([
      {
        $match: {
          repositoryId: {
            $in: repoIds,
          },
          ...dateRangeFilterPipeline('source.createdAt', startDate, endDate),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$user._id',
          user: { $first: '$user' },
        },
      },
      {
        $project: {
          '_id': 0,
          'user._id': 1,
          'user.firstName': 1,
          'user.lastName': 1,
          'user.username': 1,
          'user.avatarUrl': 1,
        },
      }
,
    ]).exec();
    return values;
  } catch (err) {
    const error = new errors.NotFound(err);
    logger.error(error);
    throw error;
  }
};

export const getUniqueRequesters = async (repoIds, startDate, endDate) => {
  try {
    const values = await SmartComment.aggregate([
      {
        $match: {
          repositoryId: {
            $in: repoIds,
          },
          ...dateRangeFilterPipeline('source.createdAt', startDate, endDate),
        },
      },
      {
        $group: {
          _id: '$githubMetadata.requester',
          githubMetadata: { $first: '$githubMetadata' },
        },
      },
      {
        $project: {
          'githubMetadata.requester': 1,
          'githubMetadata.requesterAvatarUrl': 1,
          '_id': 0,
        },
      }
,
    ]).exec();
    return values;
  } catch (err) {
    const error = new errors.NotFound(err);
    logger.error(error);
    throw error;
  }
};

export const getUniquePullRequests = async (repoIds, startDate, endDate) => {
  try {
    const values = await SmartComment.aggregate([
      {
        $match: {
          repositoryId: {
            $in: repoIds,
          },
          ...dateRangeFilterPipeline('source.createdAt', startDate, endDate),
        },
      },
      {
        $group: {
          _id: '$githubMetadata.url',
          githubMetadata: { $first: '$githubMetadata' },
        },
      },
      {
        $project: {
          'githubMetadata.url': 1,
          'githubMetadata.pull_number': 1,
          'githubMetadata.title': 1,
          'githubMetadata.head': 1,
          'githubMetadata.updated_at': 1,
          '_id': 0,
        },
      },
    ]).exec();
    return values;
  } catch (err) {
    const error = new errors.NotFound(err);
    logger.error(error);
    throw error;
  }
};
