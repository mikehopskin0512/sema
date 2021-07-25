import { find } from 'lodash';
import Collection from './collectionModel';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import { findById as findUserById, update as updateUser } from '../../users/userService';

export const findById = async (id, select) => {
  try {
    const query = Collection.findOne({ _id: id});
    if (select) {
      query.select(select)
    }
    const collection = await query.lean().exec();
    return collection;
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