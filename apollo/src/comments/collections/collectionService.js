import mongoose from 'mongoose';
import { get } from 'lodash';
import Collection from './collectionModel';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import {
  findById as findUserById,
  patch as updateUser,
  findUserCollectionsByUserId,
  populateCollectionsToUsers,
} from '../../users/userService';

const { Types: { ObjectId } } = mongoose;

export const create = async ({
  name,
  description,
  tags,
  comments,
  author,
  source = {}
}) => {
  try {
    const newCollection = new Collection({
      name,
      description,
      tags,
      comments,
      author,
      source,
    })
    const savedCollection = await newCollection.save();
    return savedCollection;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const createMany = async (collections, userId) => {
  try {
    // Should we add a field for which team this collection is for once teams feature is implemented?
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

export const getUserCollectionsById = async (id) => {
  try {
    const user = await findUserCollectionsByUserId(id);
    if (user) {
      const collections = user.collections.filter((collection) => collection.collectionData).map((collection) => {
        const { collectionData = { comments: [] } } = collection;
        const { comments, tags } = collectionData;
        let languages = [];
        let guides = [];
        if (tags?.length > 0) {
          languages = tags.filter((tag) => tag.type === 'language').map((tag) => tag.label);
          guides = tags.filter((tag) => tag.type === 'guide').map((tag) => tag.label);
        } else {
          comments.forEach((comment) => {
            comment.tags.forEach((tagItem) => {
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
            ...collectionData,
            commentsCount: comments.length,
            source: collectionData?.source?.name,
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
      const newUserData = await updateUser(userId, {collections: newCollections});
      return {
        status: 200,
        message: "User updated!",
        user: newUserData,
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
