import mongoose from 'mongoose';
import errors from '../../shared/errors';
import logger from '../../shared/logger';
import {
  findById as findUserById,
  findUserCollectionsByUserId,
  patch as updateUser, populateCollectionsToUsers,
} from '../../users/userService';
import { bulkUpdateTeamCollections, getTeamById as findTeamById, updateTeam } from '../../teams/teamService';
import Collection from './collectionModel';
import { COLLECTION_TYPE } from './constants';
import User from "../../users/userModel";

const { Types: { ObjectId } } = mongoose;

export const create = async (collection, userId, teamId) => {
  try {
    const newCollection = new Collection({
      ...collection,
      tags: collection.tags ? collection.tags.map((tag) => ({
        ...tag,
        tag: ObjectId.isValid(tag.tag) ? ObjectId(tag.tag) : null
      })) : [],
      createdBy: ObjectId(userId),
    });
    const createdCollection = await newCollection.save();
    const isActiveCollection = collection.type !== COLLECTION_TYPE.COMMUNITY;

    const isDefaultUserCollection = collection.name.toLowerCase() === process.env.DEFAULT_COLLECTION_NAME
    if (isDefaultUserCollection) {
      return createdCollection;
    }

    switch (collection.type) {
      case COLLECTION_TYPE.COMMUNITY:
        await populateCollectionsToUsers([createdCollection._id]);
        await bulkUpdateTeamCollections(createdCollection._id, null, isActiveCollection);
        break;
      case COLLECTION_TYPE.TEAM:
        await bulkUpdateTeamCollections(createdCollection._id, teamId, isActiveCollection)
        break;
      case COLLECTION_TYPE.PERSONAL:
        await populateCollectionsToUsers([createdCollection._id], userId);
        break;
      default:
        return;
    }

    return createdCollection;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const createMany = async (collections, type, userId, teamId) => {
  try {
    const cols = collections.map((collection) => ({
      ...collection,
      tags: collection.tags.map((tag) => {
        const tags = {
          label: tag.label,
          type: tag.type,
          tag: ObjectId.isValid(tag.tag) ? ObjectId(tag.tag) : null
        }
        return tags;
      }),
      createdBy: userId && ObjectId(userId)
    }));
    const newCollections = await Collection.insertMany(cols, { ordered: false });
    return newCollections;
  } catch (err) {
    // When using "unordered" insertMany, Mongo will ignore dup key errors and only insert new records
    // However it will throw an error, so data needs to be conditionally returned via catch block
    const { name, insertedDocs = [] } = err;
    if (name === 'BulkWriteError' && insertedDocs.length > 0) {
      return insertedDocs;
    }

    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const findById = async (id) => {
  try {
    const query = Collection.findOne({ _id: id});
    const collection = await query.lean().populate({
      path: 'comments',
      model: 'SuggestedComment',
      populate: {
        path: 'engGuides.engGuide',
        model: 'EngGuide'
      }
    }).sort({ createdAt: -1 }).exec();
    return collection;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findByType = async (type) => {
  try {
    const collections = Collection.find({ type }).exec();
    return collections;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getUserCollectionsById = async (id, teamId = null) => {
  try {
    const parent = teamId ? await findTeamById(teamId) : await findUserCollectionsByUserId(id);
    if (parent) {
      const collections = parent.collections?.filter((collection) => collection.collectionData).map((collection) => {
        const { collectionData : { comments, tags, source = null } } = collection;
        let languages = [];
        let guides = [];
        if (tags?.length > 0) {
          languages = tags.filter((tag) => tag.type === 'language').map((tag) => tag.label);
          guides = tags.filter((tag) => tag.type === 'guide').map((tag) => tag.label);
        } else {
          comments?.forEach((comment) => {
            comment.tags?.forEach((tagItem) => {
              const { tag } = tagItem;
              if (tag?.type === 'language' && !languages.includes(tag.label)) {
                languages.push(tag.label)
              }
              if (tag?.type === 'guide' && !guides.includes(tag.label)) {
                guides.push(tag.label)
              }
            })
          });
        }
        return {
          ...collection,
          collectionData: {
            ...collection.collectionData,
            commentsCount: comments?.length,
            source: source?.name,
            languages,
            guides,
            comments: undefined,
          }
        }
      })
      return collections;
    }
    return {
      statusCode: 400,
      message: 'Unable to process request',
    };
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const update = async (collection) => {
  const { _id } = collection;
  try {
    const query = Collection.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: collection },
      { new: true },
    );
    const updatedCollection = await query.lean().exec();
    return updatedCollection;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const pushCollectionComment = async (collectionId, suggestedCommentId) => {
  try {
    const query = Collection.findOneAndUpdate(
      { _id: new ObjectId(collectionId) },
      { $push: { comments: ObjectId(suggestedCommentId) }}
    );
    const updatedCollection = await query.lean().exec();
    return updatedCollection;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const toggleActiveCollection = async (userId, collectionId) => {
  try {
    const user = await findUserById(userId);
    if (user) {
      const { collections } = user;
      const newCollections = collections.map((item) => {
        if (item?.collectionData?._id?.equals(collectionId)) {
          return {
            collectionData: new ObjectId(item?.collectionData?._id),
            isActive: !item.isActive,
          }
        }
        return {
          collectionData: new ObjectId(item?.collectionData?._id),
          isActive: item.isActive,
        };
      });
      await updateUser(userId, {collections: newCollections});
      const newUser = await findUserById(userId);
      return {
        status: 200,
        message: "User updated!",
        user: newUser,
      };
    }
    return {
      status: 400,
      message: "User not found.",
      user: null,
    };
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
}

export const toggleTeamsActiveCollection = async (teamId, collectionId) => {
  try {
    const team = await findTeamById(teamId);
    if (team) {
      const { collections } = team;
      const newCollections = collections.map((item) => {
        const isNeedUpdate = item?.collectionData?._id?.equals(collectionId);
        return {
          collectionData: new ObjectId(item?.collectionData?._id),
          isActive: isNeedUpdate ? !item.isActive : item.isActive,
        }
      });
      await updateTeam({...team, collections: newCollections});
      const newTeam = await findTeamById(teamId);
      return {
        status: 200,
        message: "Team has been updated!",
        team: newTeam,
      };
    }
    return {
      status: 400,
      message: "Team not found.",
      team: null,
    };
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
}

export const findByAuthor = async (author) => {
  try {
    const collections = Collection.find({ author });
    return collections;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const createUserCollection = async (username) => {
  try {
    const defaultCollection = {
      name: 'My Snippets',
      description: 'Have a code review comment you frequently reuse? Add it here and it will be ready for your next review.',
      author: username,
      isActive: true,
      type: COLLECTION_TYPE.PERSONAL,
      comments: [],
    };
    const userCollection = await create(defaultCollection);
    return userCollection
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const createTeamCollection = async (team) => {
  try {
    const collection = {
      name: `${team.name}'s Snippets`,
      description: '',
      author: team.name,
      isActive: true,
      type: COLLECTION_TYPE.TEAM,
      comments: [],
    };
    return await create(collection);
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getCollectionMetadata = async (id) => {
  try {
    const collection = await Collection.findById(id).select({ name: 1, description: 1, type: 1}).lean().exec();
    return collection;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};
