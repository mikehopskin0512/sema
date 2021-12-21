import {
  subMonths, subWeeks, subDays, isAfter, format, endOfDay, formatDistanceToNowStrict,
} from 'date-fns';
import mongoose from 'mongoose';
import * as Json2CSV from 'json2csv';
import { isEmpty, uniq, uniqBy } from 'lodash';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import SmartComment from './smartCommentModel';
import Reaction from '../reaction/reactionModel';
import User from '../../users/userModel';

import { fullName } from '../../shared/utils';

const { Types: { ObjectId } } = mongoose;
const { Parser } = Json2CSV;

export const create = async ({
  commentId = null,
  comment = null,
  userId = null,
  location = null,
  suggestedComments = null,
  reaction = null,
  tags = null,
  githubMetadata = null,
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
    });
    const savedSmartComment = await smartComment.save();
    return savedSmartComment;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const getSmartComments = async ({ repo }) => {
  try {
    const query = SmartComment.find();
    query.where('githubMetadata.repo_id', repo);
    const smartComments = await query.lean().populate('userId', 'firstName lastName avatarUrl').exec();
    return smartComments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const filterSmartComments = async ({ reviewer, author, repoId, startDate, endDate, user }) => {
  try {
    let filter = {}
    let dateFilter = { createdAt: {} }
    if (reviewer) {
      filter = Object.assign(filter, { "githubMetadata.user.login": reviewer });
    }
    if (author) {
      filter = Object.assign(filter, { "githubMetadata.requester": author });
    }
    if (repoId) {
      filter = Object.assign(filter, { "githubMetadata.repo_id": repoId.toString() });
    }
    if (user) {
      filter = Object.assign(filter, { $or: [{ "githubMetadata.requester": user }, { "githubMetadata.user.login": user }] });
    }
    if (startDate) {
      dateFilter = Object.assign(dateFilter, { createdAt: { $gte: new Date(startDate) } });
    }
    if (endDate) {
      dateFilter = Object.assign(dateFilter, { createdAt: { $lt: new Date(endDate), ...dateFilter.createdAt } });
    }
    if (!isEmpty(dateFilter.createdAt)) {
      filter = Object.assign(filter, dateFilter);
    }

    const query = SmartComment.find(filter);
    const smartComments = await query.lean()
      .populate('userId')
      .populate('tags')
      .sort('-createdAt')
      .exec();

    return smartComments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const findByReviewer = async (reviewerId, repoId) => {
  try {
    const comments = await SmartComment.find({ "githubMetadata.user.id": reviewerId });
    return comments;

  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const findByAuthor = async (author, repoId) => {
  try {
    const comments = await SmartComment.find({ "githubMetadata.requester": author });
    return comments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
}

export const update = async (
  id,
  smartComment,
) => {
  try {
    const updatedSmartComment = await SmartComment.findOneAndUpdate({ _id: new ObjectId(id) }, smartComment);
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
    const reactionIds = await Reaction.distinct('_id', { title: { $ne: 'No reaction' } });

    if (category === 'comments_range') {
      const query = { createdAt: { $gte: subMonths(new Date(), 1) } };
      const totalCount = await SmartComment.countDocuments(query);
      const metricResult = [];

      await Promise.all(Array(Math.ceil(totalCount / 10)).fill(0).map(async (_, index) => {
        const comments = await SmartComment.find(query)
          .sort({ createdAt: -1 })
          .skip(10 * index)
          .limit(10);
        const reactions = comments.filter((comment) => !!comment.reaction
          && reactionIds.map((id) => id.toString()).indexOf(comment.reaction.toString()) !== -1).length;
        const tags = comments.filter((comment) => comment.tags && comment.tags.length).length;
        const suggestedComments = comments.filter((comment) => comment.suggestedComments && comment.suggestedComments.length).length;
        const sow = comments.filter((comment) => !!comment.reaction
          && reactionIds.map((id) => id.toString()).indexOf(comment.reaction.toString()) !== -1
          && comment.tags && comment.tags.length
          && comment.suggestedComments && comment.suggestedComments.length).length;
        const totalTags = comments.reduce((sum, comment) => (sum + comment.tags.length), 0);

        metricResult.push({
          _id: `${10 * index}-${10 * (index + 1) < totalCount ? 10 * (index + 1) : totalCount}`,
          index,
          reactions,
          tags,
          totalTags,
          suggestedComments,
          sow,
          total: 10 * (index + 1) < totalCount ? 10 : totalCount - 10 * index,
        });
      }));

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
      groupField = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
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
                if: { $ne: [{ $size: { $ifNull: ['$tags', []] } }, 0] }, then: 1, else: 0,
              },
            },
          },
          totalTags: {
            $sum: { $size: { $ifNull: ['$tags', []] } },
          },
          suggestedComments: {
            $sum: {
              $cond: {
                if: { $ne: [{ $size: { $ifNull: ['$suggestedComments', []] } }, 0] }, then: 1, else: 0,
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
                    { $ne: [{ $size: { $ifNull: ['$suggestedComments', []] } }, 0] },
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
    ...category === 'user' ? {
      Email: item.user ? item.user.username : '',
    } : {},
    'Reactions(%)': item.total ? Math.round((item.reactions / item.total) * 100) : 0,
    'Tags(%)': item.total ? Math.round((item.tags / item.total) * 100) : 0,
    'Suggested Comments(%)': item.total ? Math.round((item.suggestedComments / item.total) * 100) : 0,
    'All(%)': item.total ? Math.round((item.sow / item.total) * 100) : 0,
    '% of Searched Comments': item.total ? Math.round((item.suggestedComments / item.total) * 100) : 0,
    'Avg # of tags per smart comment': item.total ? (item.totalTags / item.total).toFixed(2) : 0,
    ...category !== 'comments_range' ? {
      '# of smart comments': item.total,
    } : {},
  }));

  const fields = [
    groupLabel,
    ...category === 'user' ? ['Email'] : [],
    'Reactions(%)',
    'Tags(%)',
    'Suggested Comments(%)',
    'All(%)',
    '% of Searched Comments',
    'Avg # of tags per smart comment',
    ...category !== 'comments_range' ? ['# of smart comments'] : [],
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
                if: { $lt: ['$createdAt', subWeeks(new Date(), 1)] }, then: 1, else: 0,
              },
            },
          },
          activityOneWeekAgo: {
            $sum: {
              $cond: {
                if: { $gte: ['$createdAt', subWeeks(new Date(), 1)] }, then: 1, else: 0,
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
    User: fullName(item.user),
    Email: item.user.username,
    'Activity 2 weeks ago': item.activityTwoWeeksAgo,
    'Activity 1 week ago': item.activityOneWeekAgo,
  }));

  const fields = ['User', 'Email', 'Activity 2 weeks ago', 'Activity 1 week ago'];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);

  return csv;
};

export const getGrowthRepositoryMetrics = async () => {
  const metrics = [];

  const startDate = await SmartComment.findOne().select('createdAt').sort({ createdAt: 1 });

  let daysCount = 0;

  if (startDate) {
    const distanceString = formatDistanceToNowStrict(new Date(startDate.createdAt), { unit: 'day', roundingMethod: 'ceil' });
    daysCount = parseInt(distanceString.split(' ')[0], 10);
  }

  await Promise.all(Array(daysCount + 1).fill(0).map(async (_, index) => {
    const date = subDays(new Date(), index);
    const groupQuery = [{
      $group: {
        _id: '$userId',
        repos: { $push: '$githubMetadata.repo' },
      },
    }];

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

    const totalDayRepos = oneDayRepos.reduce((sum, el) => sum + uniq(el.repos).length, 0);
    const totalWeekRepos = oneWeekRepos.reduce((sum, el) => sum + uniq(el.repos).length, 0);
    const totalMonthRepos = oneMonthRepos.reduce((sum, el) => sum + uniq(el.repos).length, 0);

    metrics.push({
      date,
      oneDayRepos: oneDayRepos.length ? (totalDayRepos / registeredCount).toFixed(2) : 0,
      oneWeekRepos: oneWeekRepos.length ? (totalWeekRepos / registeredCount).toFixed(2) : 0,
      oneMonthRepos: oneMonthRepos.length ? (totalMonthRepos / registeredCount).toFixed(2) : 0,
    });
  }));

  metrics.sort((a, b) => (isAfter(a.date, b.date) ? -1 : 1));
  return metrics;
};

export const exportGrowthRepositoryMetrics = async () => {
  const metrics = await getGrowthRepositoryMetrics();

  const mappedData = metrics.map((item) => ({
    Date: format(new Date(item.date), 'yyyy-MM-dd'),
    'Day 1': item.oneDayRepos,
    'Day 7': item.oneWeekRepos,
    'Day 30': item.oneMonthRepos,
  }));

  const fields = ['Date', 'Day 1', 'Day 7', 'Day 30'];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);

  return csv;
};

export const findByExternalId = async (repoId, populate, createdAt) => {
  try {
    let findQuery = {
      "githubMetadata.repo_id": repoId,
    }
    if (createdAt) {
      findQuery = {
        ...findQuery,
        createdAt
      }
    }
    const query = SmartComment.find(findQuery);
    if (populate) {
      query.populate('userId').populate('tags');
    }
    const comments = await query.sort({ createdAt: -1 }).exec();
    return comments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const getSuggestedMetrics = async ({ page, perPage, search, sortDesc }, isExport = false) => {
  const userIds = search ? (await User.distinct('_id', {
    $or: [
      { username: RegExp(search, 'gi') },
      { firstName: RegExp(search, 'gi') },
      { lastName: RegExp(search, 'gi') },
    ],
  })) : [];
  const reactionIds = search ? (await Reaction.distinct('_id', {
    title: RegExp(search, 'gi'),
  })) : [];

  const query = SmartComment.find(search ? {
    $or: [
      { comment: new RegExp(search, 'gi') },
      { 'githubMetadata.url': new RegExp(search, 'gi') },
      { 'githubMetadata.requester': new RegExp(search, 'gi') },
      { userId: { $in: userIds } },
      { reaction: { $in: reactionIds } },
    ],
  } : {})
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
    Comment: item.comment,
    Reaction: item.reaction && item.reaction.title,
    Tags: item.tags.length,
    'Suggested Comments': item.suggestedComments.length,
    Date: item.createdAt ? format(new Date(item.createdAt), 'yyyy-MM-dd hh:mm:ss') : '',
    Repo: item.githubMetadata && item.githubMetadata.url,
    Email: item.userId && item.userId.username,
    Author: item.githubMetadata && item.githubMetadata.requester,
    'Reviewer Email': item.userId && item.userId.username,
    'Reviewer Name': item.userId && fullName(item.userId),
  }));

  const { Parser } = Json2CSV;
  const fields = ['Comment', 'Reaction', 'Tags', 'Suggested Comments', 'Date', 'Repo', 'Email', 'Author', 'Reviewer Email', 'Reviewer Name'];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);

  return csv;
};

export const getSmartCommentsByExternalId = async (externalId) => {
  try {
    const smartComments = SmartComment.find({ 'githubMetadata.repo_id': externalId }).exec();
    return smartComments;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getPullRequestsByExternalId = async (externalId) => {
  try {
    const smartComments = SmartComment.find({ 'githubMetadata.repo_id': externalId }).distinct('githubMetadata.url').exec();
    return smartComments;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getSmartCommentersByExternalId = async (externalId) => {
  try {
    const smartComments = SmartComment.find({ 'githubMetadata.repo_id': externalId }).distinct('githubMetadata.user.login').exec();
    return smartComments;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getSmartCommentsTagsReactions = async ({ author, reviewer, repoId, startDate, endDate, user }) => {
  try {
    const filter = { reviewer, author, repoId, startDate, endDate, user };
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

export const getTotalReactionsOfComments = (smartComments = []) => {
  return smartComments
    .filter((comment) => comment?.reaction)
    .reduce((acc, comment) => {
      const { reaction } = comment;
      if (acc?.[reaction]) {
        acc[reaction]++
      } else {
        acc[reaction] = 1;
      }
      return acc
    }, {});
};

export const getTotalTagsOfComments = (smartComments = []) => {
  return smartComments
    .filter((comment) => comment?.tags?.length)
    .reduce((acc, comment) => {
      const { tags } = comment;
      const total = tags.reduce((acc, tag) => {
        const { _id: tagId } = tag;
        if (acc?.[tagId]) {
          acc[tagId]++
        } else {
          acc[tagId] = 1
        }
        return acc;
      }, {})
      for (const [key, val] of Object.entries(total)) {
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += val
      }
      return acc
    }, {})
};

export const _getSmartCommentersCount = (smartComments = []) => {
  return uniqBy(smartComments, (item) => item.userId?.valueOf() || 0).length || 0;
};

export const _getPullRequests = (smartComments = []) => {
  return uniqBy(smartComments, 'githubMetadata.pull_number').length || 0;
};