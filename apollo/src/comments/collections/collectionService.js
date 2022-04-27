import mongoose from 'mongoose';
import errors from '../../shared/errors';
import logger from '../../shared/logger';
import {
  findById as findUserById,
  findUserCollectionsByUserId,
  patch as updateUser,
} from '../../users/userService';
import { getTeamById as findTeamById, updateTeam } from '../../teams/teamService';
import Collection from './collectionModel';
import { COLLECTION_TYPE } from './constants';
import User from "../../users/userModel";

const { Types: { ObjectId } } = mongoose;

export const create = async (collection, userId, teamId) => {
  try {
    const newCollection = new Collection({
      ...collection,
      isActive: true,
      tags: collection.tags ? collection.tags.map((tag) => ({
        ...tag,
        tag: ObjectId.isValid(tag.tag) ? ObjectId(tag.tag) : null
      })) : [],
      teamId,
      createdBy: ObjectId(userId),
    });
    const createdCollection = await newCollection.save();

    const isDefaultUserCollection = collection.name.toLowerCase() === process.env.DEFAULT_COLLECTION_NAME
    if (isDefaultUserCollection) {
      return createdCollection;
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
      type,
      teamId,
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
    const collections = Collection.find({ type }).lean().populate({
      path: 'comments',
      model: 'SuggestedComment',
    }).sort({ createdAt: -1 }).exec();
    return collections;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

const addPublicCollectionsToList = (collections, communityCollectionDataList) => {
  const communityCollections = communityCollectionDataList.map((communityCollectionData) => ({
    isActive: false,
    collectionData: communityCollectionData,
  }));
  const basicCollections = collections || [];
  const basicCollectionIdSet = new Set(basicCollections.filter(collection =>  collection.collectionData).map(collection =>  collection.collectionData._id.toString()));
  const communityCollectionsToAdd  = communityCollections.filter(collection => !basicCollectionIdSet.has(collection.collectionData._id.toString()));  
  return [...basicCollections , ...communityCollectionsToAdd]

}

export const getUserCollectionsById = async (id, teamId = null) => {
  try {
    const parent = teamId ? await findTeamById(teamId) : await findUserCollectionsByUserId(id);
    const communityCollectionDataList = await findByType(COLLECTION_TYPE.COMMUNITY);
    if (parent) {
      const collectionFullList = addPublicCollectionsToList(parent.collections, communityCollectionDataList); 
      const collections = collectionFullList.filter((collection) => collection.collectionData).map((collection) => {
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

const isEqualItemById = (item, id) => item?.collectionData?._id?.equals(id);

const isIdInCollectionList = (collections, collectionId) => {
  const foundCollection = collections.find((item) => isEqualItemById(item, collectionId));
  return !!foundCollection;
}

const toggleOtherCollectionActiveStatus = (collections, collectionId) => {
  return collections.map((item) => {
    return {
      collectionData: new ObjectId(item?.collectionData?._id),
      isActive: isEqualItemById(item, collectionId)? !item.isActive: item.isActive,
    };
  });
}

const toggleCommunityCollectionActiveStatus = (collections, collectionId) => {
  if(isIdInCollectionList(collections, collectionId)) {
    return collections.filter((item) => !isEqualItemById(item, collectionId));
  }

  const justEnabledCollecion = {
    collectionData: new ObjectId(collectionId),
    isActive: true,
  };
  return [...collections, justEnabledCollecion]
}

const toggleCollectionActiveStatus = (collections, collectionId, collectionType) => {
  if(collectionType !== COLLECTION_TYPE.COMMUNITY) {
    return toggleOtherCollectionActiveStatus(collections, collectionId);
  }
  return toggleCommunityCollectionActiveStatus(collections, collectionId);
}

export const toggleActiveCollection = async (userId, collectionId, collectionType) => {
  try {
    const user = await findUserById(userId);
    if (user) {
      const { collections } = user;
      const newCollections = toggleCollectionActiveStatus(collections, collectionId, collectionType);
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

export const toggleTeamsActiveCollection = async (teamId, collectionId, collectionType) => {
  try {
    const team = await findTeamById(teamId);
    if (team) {
      const { collections } = team;
      const newCollections = toggleCollectionActiveStatus(collections, collectionId, collectionType);
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

export const getCollectionsActiveByDefault = async () => {
  try {
    return Collection.find({ isActiveByDefault: true, type: COLLECTION_TYPE.COMMUNITY });
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getDefaultCollections = async(collectionId) => {
  const collectionsActiveByDefault = await getCollectionsActiveByDefault();
  const collectionIdList = [collectionId, ...collectionsActiveByDefault.map(collection => collection._id)];
  return collectionIdList.map((id) => ({
    isActive: true,
    collectionData: id,
    _id: new ObjectId(),
  }));
}

export const createUserCollection = async (username, userId) => {
  try {
    const defaultCollection = {
      name: 'My Snippets',
      description: 'Have a code review comment you frequently reuse? Add it here and it will be ready for your next review.',
      author: username,
      isActive: true,
      type: COLLECTION_TYPE.PERSONAL,
      comments: [],
    };
    const userCollection = await create(defaultCollection, userId);
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
    return await create(collection, team.createdBy, team._id);
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
