import { subMonths } from 'date-fns';
import * as Json2CSV from 'json2csv';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import SmartComment from './smartCommentModel';

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

export const getSOWMetrics = async (params) => {
  try {
    const { category } = params;
    if (category === 'comments_range') {
      const query = { createdAt: { $gte: subMonths(new Date(), 1) } };
      const totalCount = await SmartComment.countDocuments(query);
      const metricResult = [];
      await Promise.all(Array(Math.ceil(totalCount / 10)).fill(0).map(async (_, index) => {
        const comments = await SmartComment.find(query).sort({ createdAt: -1 }).skip(10 * index).limit(10);
        const reactions = comments.filter((comment) => !!comment.reaction).length;
        const tags = comments.filter((comment) => comment.tags && comment.tags.length).length;
        const suggestedComments = comments.filter((comment) => comment.suggestedComments && comment.suggestedComments.length).length;
        const sow = comments.filter((comment) => !!comment.reaction
          && comment.tags && comment.tags.length
          && comment.suggestedComments && comment.suggestedComments.length).length;

        metricResult.push({
          _id: `${10 * index}-${10 * (index + 1) < totalCount ? 10 * (index + 1) : totalCount}`,
          index,
          reactions,
          tags,
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
                if: { $ne: [{ $ifNull: ['$reaction', 0] }, 0] }, then: 1, else: 0,
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
      ...(category === 'day' ? [{ $sort: { _id: -1 } }] : []),
    ]);

    return comments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

const fullName = (user) => {
  if (!user) return '';

  const { firstName = '', lastName = '' } = user;

  return `${firstName} ${lastName}`;
};

export const exportSowMetrics = async (params) => {
  const comments = await getSOWMetrics(params);
  const { category } = params;

  const getGroupLabel = () => {
    if (category === 'day') return 'Date';
    if (category === 'user') return 'User';
    return 'Comments Range';
  };

  const groupLabel = getGroupLabel();
  const mappedData = comments.map((item) => ({
    [groupLabel]: category === 'user' ? fullName(item.user) : item._id,
    'Reactions(%)': item.total ? Math.round((item.reactions / item.total) * 100) : 0,
    'Tags(%)': item.total ? Math.round((item.tags / item.total) * 100) : 0,
    'Suggested Comments(%)': item.total ? Math.round((item.suggestedComments / item.total) * 100) : 0,
    'All(%)': item.total ? Math.round((item.sow / item.total) * 100) : 0,
  }));

  const { Parser } = Json2CSV;
  const fields = [groupLabel, 'Reactions(%)', 'Tags(%)', 'Suggested Comments(%)', 'All(%)'];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);

  return csv;
};
