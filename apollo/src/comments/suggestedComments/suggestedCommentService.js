import mongoose from 'mongoose';
import SuggestedComment from './suggestedCommentModel';
import { create as createTags, findTags } from '../tags/tagService';
import User from '../../users/userModel';
import Query from '../queryModel';
import errors from '../../shared/errors';
import logger from '../../shared/logger';
import { fullName } from '../../shared/utils';

const nodeEnv = process.env.NODE_ENV || 'development';

const { Types: { ObjectId } } = mongoose;
const SUGGESTED_COMMENTS_TO_DISPLAY = 4;

const getUserSuggestedComments = async (userId, searchResults = []) => {
  const userActiveCommentsQuery = [
    {
      $match: { _id: new ObjectId(userId) },
    },
    {
      $project: {
        collections: {
          $filter: {
            input: '$collections',
            as: 'collection',
            cond: { $eq: ['$$collection.isActive', true] },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'collections',
        localField: 'collections.collectionData',
        foreignField: '_id',
        as: 'collections',
      },
    },
    {
      $project: {
        collections: {
          $filter: {
            input: '$collections',
            as: 'collection',
            cond: { $eq: ['$$collection.isActive', true] },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        comments: {
          $let: {
            vars: {
              userComments: {
                $reduce: {
                  input: '$collections.comments',
                  initialValue: [],
                  in: { $setUnion: ['$$value', '$$this'] },
                },
              },
            },
            in: { $setIntersection: ['$$userComments', searchResults] },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'suggestedComments',
        localField: 'comments',
        foreignField: '_id',
        as: 'comments',
      },
    },
  ];

  const [{ comments }] = await User.aggregate(userActiveCommentsQuery);
  return comments;
};

const searchIndex = async (searchQuery) => {
  if (nodeEnv === 'development') {
    return [];
    return searchResults;
  } else {
    const [{ searchResults }] = await SuggestedComment.aggregate([
      {
        $search: {
          index: 'suggestedComments',
          text: {
            query: searchQuery,
            path: { wildcard: '*', },
            fuzzy: { maxEdits: 2, prefixLength: 3 },
          },
        },
      },
      {
        $group: {
            _id: 'searchResults',
            searchResults: { $push: '$_id' }
        }
      }
    ]);
    return searchResults;
  }
};

const searchComments = async (user, searchQuery) => {
  let searchResults = await searchIndex(searchQuery);
  
  // The number of suggested comments to list
  searchResults.slice(0, SUGGESTED_COMMENTS_TO_DISPLAY);

  const comments = await getUserSuggestedComments(user, searchResults);
  const returnResults = comments.map(
    ({
      _id: id,
      title,
      comment,
      engGuides,
      source: { name: sourceName } = '',
      source: { url: sourceUrl } = '',
    }) => ({
      id,
      title,
      comment,
      sourceName,
      sourceUrl,
      engGuides,
    }),
  );

  // Store the search case to database
  const newQuery = new Query({
    searchTerm: searchQuery,
    matchedCount: searchResults.length,
  });
  await newQuery.save();

  return {
    query: {
      id: newQuery._id,
      searchTerm: newQuery.searchTerm,
    },
    result: returnResults,
  };
};

const suggestCommentsInsertCount = async ({ page, perPage }) => {
  const query = [
    {
      $lookup: {
        from: 'smartComments',
        localField: '_id',
        foreignField: 'suggestedComments',
        as: 'smartComments',
      },
    },
    {
      $addFields: {
        insertCount: { $size: '$smartComments' },
      },
    },
    {
      $sort: { insertCount: -1 },
    },
  ];

  const totalCount = await SuggestedComment.aggregate([
    ...query,
    {
      $count: 'total',
    },
  ]);

  const suggestedComments = await SuggestedComment.aggregate([
    ...query,
    {
      $skip: (page - 1) * perPage,
    },
    {
      $limit: perPage,
    },
  ]);

  return {
    totalCount: totalCount[0] ? totalCount[0].total : 0,
    suggestedComments,
  };
};

const makeTagsList = async (tags) => {
      const { existingTags, newTags } = tags;
  let savedTags = [];
  if (newTags && newTags.length > 0) {
        savedTags = await createTags(newTags);
      }
      const existingTagsArr = await findTags(existingTags.map(id => ObjectId(id)));
  const suggestedCommentTags = [...existingTagsArr, ...savedTags].map((item) => ({
        label: item.label,
        type: item.type,
    tag: ObjectId(item._id),
  }));
  return suggestedCommentTags;
};

const create = async (suggestedComment) => {
  try {
    const { title, comment, source, tags } = suggestedComment;
    let suggestedCommentTags = [];
    if (tags) {
      suggestedCommentTags = await makeTagsList(tags);
    }
    const newSuggestedComment = new SuggestedComment({
      title,
      comment,
      source,
      tags: suggestedCommentTags,
    });
    const savedSuggestedComment = await newSuggestedComment.save();
    return savedSuggestedComment;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

const update = async (id, body) => {
  try {
    const { tags } = body;
    if (tags) {
      body.tags = await makeTagsList(tags);
    }
    const suggestedComment = await SuggestedComment.findById(id);
    suggestedComment.set(body);
    await suggestedComment.save();

    return suggestedComment;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

const bulkCreateSuggestedComments = async (comments, user) => {
  try {
    const suggestedComments = await Promise.all(comments.map(async (comment) => ({
      ...comment,
      ...comment.tags ? { tags: await makeTagsList(comment.tags) } : {},
      author: comment.author ? comment.author : fullName(user.user),
    })));

    return await SuggestedComment.create(suggestedComments);
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

const bulkUpdateSuggestedComments = async (comments) => {
  try {
    const suggestedComments = await Promise.all(comments.map(async (comment) => ({
      ...comment,
      ...comment.tags ? { tags: await makeTagsList(comment.tags) } : {},
    })));

    return await Promise.all(suggestedComments.map(async (item) => {
      const result = await SuggestedComment.updateOne({ _id: item._id }, { $set: { ...item } });
      return result;
    }));
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

const getSuggestedCommentsByIds = async (params) => {
  const query = SuggestedComment.find();

  if (params.comments) {
    query.where('_id', { $in: params.comments });
  }

  const suggestedComments = await query.exec();
  const totalCount = await SuggestedComment.countDocuments(query);
  return { suggestedComments, totalCount };
};

module.exports = {
  searchComments,
  suggestCommentsInsertCount,
  create,
  update,
  bulkCreateSuggestedComments,
  bulkUpdateSuggestedComments,
  getSuggestedCommentsByIds,
};
