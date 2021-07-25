import { subMonths } from 'date-fns';
import { subWeeks } from 'date-fns';
import * as Json2CSV from 'json2csv';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import SmartComment from './smartCommentModel';
import Reaction from '../reaction/reactionModel';
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

const update = async (
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

const getSowMetrics = async (params) => {
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

const exportSowMetrics = async (params) => {
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

const getUserActivityChangeMetrics = async () => {
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

const exportUserActivityChangeMetrics = async () => {
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


module.exports = {
  create,
  update,
  getSowMetrics,
  exportSowMetrics,
  getUserActivityChangeMetrics,
  exportUserActivityChangeMetrics
};
