import mongoose from 'mongoose';

import Snapshot from './snapshotModel';
import logger from '../shared/logger';
import errors from '../shared/errors';

import { addSnapshot } from '../portfolios/portfolioService';

const { Types: { ObjectId } } = mongoose;

const structureSnapshot = ({
  _id = null, userId = null, title = null, description = null, componentType = null, componentData = null,
}) => {
  const components = {
    comments: (data) => {
      data.user = new ObjectId(data.user);
      return { comments: data, summaries: {}, tags: {} };
    },
    summaries: (data) => {
      data.reactions = data.reactions.map((id) => (new ObjectId(id)));
      return { comments: {}, summaries: data, tags: {} };
    },
    tags: (data) => {
      data.tags = data.tags.map((id) => (new ObjectId(id)));
      return { comments: {}, summaries: {}, tags: data };
    },
  };
  return {
    _id: new ObjectId(_id),
    userId: new ObjectId(userId),
    title,
    description,
    componentType,
    componentData: components[componentType](componentData),
  };
};

export const create = async (snapshot, portfolioId) => {
  try {
    const newSnapshot = new Snapshot(structureSnapshot(snapshot));
    const savedSnapshot = await newSnapshot.save();
    if (portfolioId) {
      await addSnapshot(portfolioId, savedSnapshot._id);
    }
    return savedSnapshot;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const update = async (snapshotId, snapshot) => {
  try {
    const updatedSnapshot = await Snapshot.findOneAndUpdate(
      { _id: new ObjectId(snapshotId) },
      { $set: structureSnapshot(snapshot) },
      { new: true },
    ).exec();
    return updatedSnapshot;
  } catch (err) {
    const error = new errors.NotFound(err);
    logger.error(error);
    throw error;
  }
};

export const deleteOne = async (snapshotId) => {
  try {
    const deletedSnapshot = await Snapshot.findByIdAndDelete(new ObjectId(snapshotId)).exec();
    return deletedSnapshot;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};
