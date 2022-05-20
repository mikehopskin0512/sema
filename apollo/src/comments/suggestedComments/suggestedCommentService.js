import mongoose from 'mongoose';
import { COLLECTION_TYPE } from '../collections/constants';
import SuggestedComment from './suggestedCommentModel';
import { create as createTags, findTags } from '../tags/tagService';
import User from '../../users/userModel';
import Query from '../queryModel';
import errors from '../../shared/errors';
import logger from '../../shared/logger';
import { fullName } from '../../shared/utils';
import { fetchMetadata } from "../../shared/preview";
import * as Json2CSV from 'json2csv';
import { format } from 'date-fns';
import UserRole from "../../userRoles/userRoleModel";
import suggestedComments from "./index";
import { getCollectionMetadata } from "../collections/collectionService";

const nodeEnv = process.env.NODE_ENV || 'development';

const { Types: { ObjectId } } = mongoose;
const SNIPPETS_TO_DISPLAY = 4;
const { Parser } = Json2CSV;

const hasPersonalCollection = (collections) => !!collections.find(c => c.type === COLLECTION_TYPE.PERSONAL)
const sortPersonalSnippets = (snippets) => {
  return [...snippets].sort((a, b) => hasPersonalCollection(a.collections) < hasPersonalCollection(b.collections) ? 1 : -1);
}

const getUserSnippets = async (userId, searchResults = [], allCollections) => {
  const userActiveSnippetsQuery = [
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
        as: 'snippets',
      },
    },
  ];
  const allUserSnippetsQuery = [
    {
      $match: { _id: new ObjectId(userId) },
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
        as: 'snippets',
      },
    },
  ];

  const snippetsQuery = allCollections ? allUserSnippetsQuery : userActiveSnippetsQuery;
  const snippetsData = await User.aggregate(snippetsQuery);
  if (!snippetsData || snippetsData.length === 0) return [];
  const [{ snippets }] = snippetsData;
  return sortPersonalSnippets(snippets);
};

const getTeamSnippets = async(userId, teamId, searchResults = []) => {
  const teamActiveSnippetsQuery = [
    {
      $match: { user: new ObjectId(userId), team: new ObjectId(teamId) }
    }, {
      $lookup: {
        from: 'teams',
        localField: 'team',
        foreignField : '_id',
        as: 'team'
      }
    }, {
      $project: {
        collections: {
          $filter: {
            input: { $first: '$team.collections' },
            as: 'collection',
            cond: { $eq: ['$$collection.isActive', true] }
          }
        }
      }
    }, {
      $lookup: {
        from: 'collections',
        localField: 'collections.collectionData',
        foreignField: '_id',
        as: 'collections'
      }
    }, {
      $project: {
        _id: 0,
        comments: {
          $let: {
            vars: {
              userComments: {
                $reduce: {
                  input: '$collections.comments',
                  initialValue: [],
                  in: {$setUnion: ['$$value', '$$this']}
                }
              }
            },
            in: {$setIntersection: ['$$userComments', searchResults]}
          }
        }
      }
    }, {
      $lookup: {
        from: 'suggestedComments',
        localField: 'comments',
        foreignField: '_id',
        as: 'snippets'
      }
    }
  ];

  const snippetsData = await UserRole.aggregate(teamActiveSnippetsQuery);
  if (!snippetsData || snippetsData.length === 0) return [];
  const [{ snippets }] = snippetsData;
  return snippets;
};

const searchIndex = async (searchQuery) => {
  if (nodeEnv === 'development') {
    return [];
  } else {
    const results = await SuggestedComment.aggregate([
      {
        $search: {
          index: 'suggestedCommentsAutocomplete',
          compound: {
            should: [
              {
                autocomplete: {
                  query: searchQuery,
                  path: 'title',
                  fuzzy: { maxEdits: 2, prefixLength: 3 },
                },
              },
              {
                autocomplete: {
                  query: searchQuery,
                  path: 'comment',
                  fuzzy: { maxEdits: 2, prefixLength: 3 },
                },
              },
            ],
          },
        }
      },
      {
        $group: {
          _id: 'searchResults',
          searchResults: { $push: '$_id' },
        },
      },
    ]);
    const isNoResults = !results.length
    return isNoResults ? [] : results[0].searchResults;
  }
};

export const searchComments = async (user, team = null, searchQuery, allCollections) => {
  const searchResults = await searchIndex(searchQuery);
  const userId = user?.toString();

  // The number of suggested comments to list
  searchResults.slice(0, SNIPPETS_TO_DISPLAY);

  const snippets = team ? await getTeamSnippets(userId, team, searchResults) : await getUserSnippets(userId, searchResults, allCollections);

  const returnResults = await Promise.all(snippets.map(async ({
      _id: id,
      title,
      comment,
      engGuides = [],
      source: { name: sourceName } = '',
      source: { url: sourceUrl } = '',
      collections = [],
      tags = [],
      author = '',
    }) => {
      const metaData = sourceUrl ? await getLinkPreviewData(sourceUrl) : null;
      return {
        id,
        title,
        comment,
        sourceName,
        sourceUrl,
        engGuides,
        collections,
        tags,
        author,
        sourceIcon: metaData?.icon || '',
      }
    }
  ));

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

export const suggestCommentsInsertCount = async ({ page, perPage }) => {
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

export const create = async (suggestedComment) => {
  try {
    const { title, comment, source, tags, enteredBy, collections } = suggestedComment;
    let suggestedCommentTags = [];
    let sourceMetaData;
    if (tags) {
      suggestedCommentTags = await makeTagsList(tags);
    }

    if (source && source.url) {
      sourceMetaData = await getLinkPreviewData(source.url);
    }

    const newSuggestedComment = new SuggestedComment({
      title,
      comment,
      source,
      tags: suggestedCommentTags,
      sourceMetaData,
      enteredBy,
      lastModified: new Date(),
      collections,
    });
    const savedSuggestedComment = await newSuggestedComment.save();
    return savedSuggestedComment;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const update = async (id, body) => {
  try {
    const { tags } = body;
    if (tags) {
      body.tags = await makeTagsList(tags);
    }
    const suggestedComment = await SuggestedComment.findById(id);
    suggestedComment.set({
      ...body,
      lastModified: new Date(),
    });

    if (!suggestedComment.sourceMetadata?.title && suggestedComment.source && suggestedComment.source.url) {
      // fetch metadata from iframely
      suggestedComment.sourceMetadata = await getLinkPreviewData(suggestedComment.source.url);
    }

    await suggestedComment.save();

    return suggestedComment;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const updateSnippetCollections = async (id, collection) => {
  try {
    const snippet = await suggestedComments.updateOne({ _id: new ObjectId(id) }, { $addToSet: { collections: collection } });
    return snippet;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const bulkCreateSuggestedComments = async (comments, collectionId, user) => {
  try {
    const collection = collectionId && await getCollectionMetadata(collectionId);
    const suggestedComments = await Promise.all(comments.map(async (comment) => ({
      ...comment,
      ...comment.tags ? { tags: await makeTagsList(comment.tags) } : {},
      author: comment.author ? comment.author : fullName(user),
      enteredBy: user._id,
      collections: collection ? [{
        collectionId: new ObjectId(collectionId),
        name: collection.name,
        type: collection.type,
      }] : [],
      lastModified: new Date(),
    })));

    for (let i = 0; i < suggestedComments.length; i++) {
      const { source } = suggestedComments[i];
      if (source && source.url) {
        suggestedComments[i].sourceMetadata = await getLinkPreviewData(source.url);
      }
    }

    return await SuggestedComment.create(suggestedComments);
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const bulkUpdateSuggestedComments = async (comments) => {
  try {
    const suggestedComments = await Promise.all(comments.map(async (comment) => ({
      ...comment,
      ...comment.tags ? { tags: await makeTagsList(comment.tags) } : {},
      sourceMetadata: comment.source?.url ? await getLinkPreviewData(comment.source.url) : comment.sourceMetadata,
      lastModified: new Date(),
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

export const getSuggestedCommentsByIds = async (params) => {
  const query = SuggestedComment.find();

  if (params.comments) {
    query.where('_id', { $in: params.comments });
  }

  const suggestedComments = await query.exec();
  const totalCount = await SuggestedComment.countDocuments(query);
  return { suggestedComments, totalCount };
};

export const getLinkPreviewData = async (url)=> {
  try {
    const { data: metadata } = await fetchMetadata(url);

    const metaIcon = metadata?.links?.icon?.find(item => item.href.includes('favicon')) || metadata?.links?.icon[0];
    const metaThumbnail = metadata?.links?.thumbnail ? metadata?.links?.thumbnail[0] : null;
    return {
      title: metadata?.meta?.title,
      icon: metaIcon?.href,
      thumbnail: metaThumbnail?.href,
    }
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export const exportSuggestedComments = async () => {
  const suggestedComments = await SuggestedComment.aggregate([
    {
      $lookup: {
        from: 'collections',
        localField: '_id',
        foreignField: 'comments',
        as: 'collection',
      }
    },
    { $unwind: { path: '$collection', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'enteredBy',
        foreignField: '_id',
        as: 'createdBy',
      }
    },
    { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
  ]);

  const mappedData = suggestedComments.map((comment) => ({
    'Title': comment.title,
    'Comment': comment.comment,
    'Collection': comment.collection ? comment.collection.name : '',
    'Author': comment.author,
    'Source name': comment.source && comment.source.name,
    'Source url': comment.source && comment.source.url,
    'Tags': comment.tags ? JSON.stringify(comment.tags.map(tag => tag.label)) : '',
    'Link': comment.link,
    'Related Links': comment.relatedLinks && comment.relatedLinks.length ? comment.relatedLinks.join(';') : '',
    'IsActive': comment.isActive,
    'Created by': comment.createdBy ? fullName(comment.createdBy) : '',
    'Created at': format(new Date(comment.createdAt), 'yyyy-MM-dd'),
    'Last modified at': comment.lastModified ? format(new Date(comment.lastModified), 'yyyy-MM-dd') : '',
    'CollectionId': comment.collectionId
  }));
  const fields = [
    'Title',
    'Comment',
    'Collection',
    'Author',
    'Source name',
    'Source url',
    'Tags',
    'Link',
    'Related Links',
    'IsActive',
    'Created by',
    'Created at',
    'Last modified at',
    'CollectionId',
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(mappedData);
  return csv;
};

