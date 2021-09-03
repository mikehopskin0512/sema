import mongoose from 'mongoose';
import FlexSearch from 'flexsearch';
import SuggestedComment from './suggestedCommentModel';
import { create as createTags, findTags } from '../tags/tagService';
import User from '../../users/userModel';
import Query from '../queryModel';
import errors from '../../shared/errors';
import logger from '../../shared/logger';
import { fullName } from '../../shared/utils';

const { Types: { ObjectId } } = mongoose;
const SUGGESTED_COMMENTS_TO_DISPLAY = 4;

const index = new FlexSearch({
  encode: 'balance',
  tokenize: 'full',
  threshold: 0,
  depth: 5,
  async: true,
  worker: 1,
  cache: true,
  stemmer: 'en',
});

const buildSuggestedCommentsIndex = async () => {
  try {
    const dbComments = await SuggestedComment.find().lean().exec();
    const reportEvery = Math.floor(dbComments.length / 10);

    dbComments.forEach(({ _id: commentId, title, comment, tags }, i) => {
      // index by MongoDB ID
      const allTags = tags.map(({ label }) => (label)).join(' ');
      const commentIndex = `${title} ${comment} ${allTags}`;
      index.add(commentId, commentIndex);
      if (i % reportEvery === 0) {
        logger.info(`Building comment bank search index: ${i} / ${dbComments.length} done`);
      }
    });
  } catch (err) {
    const error = new errors.InternalServer(err);
    logger.error(error);
    throw error;
  }

  return index;
};

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

const searchComments = async (user, searchQuery) => {
  let searchResults = await index.search(searchQuery);

  // The number of suggested comments to list
  searchResults = searchResults.slice(0, SUGGESTED_COMMENTS_TO_DISPLAY);

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
      author: fullName(user.user),
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
  buildSuggestedCommentsIndex,
  searchComments,
  suggestCommentsInsertCount,
  create,
  update,
  bulkCreateSuggestedComments,
  bulkUpdateSuggestedComments,
  getSuggestedCommentsByIds,
};
