import { format, subMonths, subWeeks } from 'date-fns';
import * as Json2CSV from 'json2csv';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import SmartComment from './smartCommentModel';
import Reaction from '../reaction/reactionModel';
import User from '../../users/userModel';
import { fullName } from '../../shared/utils';

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

export const filterSmartComments = async ({ reviewer, author, repoId }) => {
  try {
    let filter = {}

    if (reviewer) {
      filter = Object.assign(filter, { "githubMetadata.user.login": reviewer });
    }
    if (author) {
      filter = Object.assign(filter, { "githubMetadata.requester": author });
    }
    if (repoId) {
      filter = Object.assign(filter, { "githubMetadata.repo_id": repoId.toString() });
    }

    const query = SmartComment.find(filter);
    const smartComments = await query.lean().populate('userId', 'firstName lastName avatarUrl').exec();

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
    const updatedSmartComment = await SmartComment.findOneAndUpdate({ _id: new ObjectId(id) }, smartComment)
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

  const { Parser } = Json2CSV;
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
  const mappedData = userActivities.map((item, index) => ({
    'User ID': item._id,
    'Email': item.user.username,
    'Activity 2 weeks ago': item.activityTwoWeeksAgo,
    'Activity 1 week ago': item.activityOneWeekAgo,
  }));

  const { Parser } = Json2CSV;
  const fields = ['User ID', 'Email', 'Activity 2 weeks ago', 'Activity 1 week ago'];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);

  return csv;
};

export const findByExternalId = async (repoId) => {
  try {
    const comments = await SmartComment.find({ "githubMetadata.repo_id": repoId });
    return comments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const getSuggestedMetrics = async ({ page, perPage, search }, isExport = false) => {
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
    .populate('userId')
    .populate('reaction');

  const totalCount = await SmartComment.countDocuments(query);

  if (!isExport) {
    query.skip((page - 1) * perPage).limit(perPage);
  }

  const smartComments = await query.exec();
  return { comments: smartComments, totalCount };
};

export const exportSuggestedMetrics = async ({ search }) => {
  const { comments } = await getSuggestedMetrics({ search }, true);
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