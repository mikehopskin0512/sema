import Collection from "./collectionModel";
import logger from '../../shared/logger';
import errors from '../../shared/errors';

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