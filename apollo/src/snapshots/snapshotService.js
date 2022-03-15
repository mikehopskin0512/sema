import mongoose from 'mongoose';

import Snapshot from './snapshotModel';
import logger from '../shared/logger';
import errors from '../shared/errors';

import { addSnapshot } from '../portfolios/portfolioService';

const { Types: { ObjectId } } = mongoose;

const structureSmartComment = ({
  smartCommentId = null, user = null, comment = null, reaction = null, tags = null, githubMetadata = {}, createdAt = null,
}) => ({
  smartCommentId: new ObjectId((smartCommentId)),
  userId: new ObjectId(user),
  comment,
  reaction: new ObjectId(reaction),
  tags,
  githubMetadata,
  createdAt,
});

const structureComponentData = ({
  smartComments = null, groupBy = 'day', yAxisType = '', dateDiff = 0, startDate = null, endDate = null,
}) => ({
  smartComments: smartComments.map((smartComment) => (structureSmartComment(smartComment))),
  groupBy,
  yAxisType,
  dateDiff: parseInt(dateDiff, 10),
  startDate: new Date(startDate),
  endDate: new Date(endDate),
});

const structureSnapshot = ({
  _id = null, userId = null, title = null, description = null, componentType = null, componentData = null,
}) => ({
  _id: _id ? new ObjectId(_id) : new ObjectId(),
  userId: new ObjectId(userId),
  title,
  description,
  componentType,
  componentData: structureComponentData(componentData),
});

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
    )
      .populate([
        {
          path: 'componentData.smartComments.tags',
          model: 'Tag',
        },
        {
          path: 'componentData.smartComments.userId',
          model: 'User',
        }
      ])
      .exec();
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
