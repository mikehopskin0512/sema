import mongoose from 'mongoose';
import { uniqBy } from 'lodash';
import Collection from './collectionModel';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import User from '../../users/userModel';
import { findById as findUserById, update as updateUser } from '../../users/userService';

const { Types: { ObjectId } } = mongoose;

export const create = async ({
  name,
  description,
  tags,
  comments,
  author,
}) => {
  try {
    const newCollection = new Collection({
      name,
      description,
      tags,
      comments,
      author
    })
    const savedCollection = await newCollection.save();
    return savedCollection;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const createMany = async (collections) => {
  try {
    const newCollections = await Collection.insertMany(collections, { ordered: false });
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
    const collections = await Collection.aggregate([
      {
        $match: { _id: new ObjectId(id)}
      },
      {
        $lookup: {
          from: 'suggestedComments',
          as: 'comments',
          pipeline: [
            {
              $lookup: {
                from: 'engGuides',
                localField: 'engGuides',
                foreignField: '_id',
                as: 'engGuides'
              }
            },
            {
              $lookup: {
                from: 'collections',
                localField: '_id',
                foreignField: 'comments',
                as: 'collection'
              }
            },
            {
              $unwind: '$collection'
            },
            {
              $unwind: {
                path: '$engGuides',
                preserveNullAndEmptyArrays: true,
              }
            },
            {
              $match: {
                'collection._id': new ObjectId(id),
              }
            },
          ]
        }
      },
    ]);
    if (collections.length > 0) {
      return collections[0];
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

export const getUserCollectionsById = async (userData) => {
  try {
    const user = await User.aggregate([
      {
        $match: { _id: new ObjectId(userData._id) },
      },
      {
        $lookup: {
          from: 'collections',
          localField: 'collections.collectionData',
          foreignField: '_id',
          as: 'collections'
        }
      },
      {
        $lookup: {
          from: 'suggestedComments',
          localField: 'collections.comments',
          foreignField: '_id',
          as: 'comments'
        }
      }
    ]);
    if (user.length > 0) {
      const { comments } = user[0];
      return comments;
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
    const user = await findUserById(userId)
    if (user) {
      const { collections } = user;
      const newCollections = collections.map((item) => {
        if (item.collectionData._id.equals(collectionId)) {
          return {
            ...item,
            isActive: !item.isActive,
          }
        }
        return item;
      })
      const newUserData = await updateUser({
        ...user,
        collections: newCollections,
      });
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
