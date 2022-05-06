import mongoose from 'mongoose';
import Snapshot from './snapshotModel';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { findManyById } from '../comments/smartComments/smartCommentService';

const { Types: { ObjectId } } = mongoose;

const structureSmartComment = ({
  _id = null, smartCommentId = null, userId = null, comment = null, reaction = null, tags = null, githubMetadata = {}, createdAt = null,
}) => ({
  smartCommentId: new ObjectId(_id),
  userId: new ObjectId(userId),
  comment,
  reaction: new ObjectId(reaction),
  tags,
  githubMetadata,
  createdAt,
});

const structureComponentData = ({
  smartComments = null, groupBy = 'day', yAxisType = '', dateDiff = 0, startDate = null, endDate = null,
}) => ({
  smartComments,
  groupBy,
  yAxisType,
  dateDiff: parseInt(dateDiff, 10),
  startDate: new Date(startDate),
  endDate: new Date(endDate),
});

const structureSnapshot = ({
  _id = null, userId = null, title = null, description = null, componentType = null, componentData = null, portfolios = [], isHorizontal = true
}) => ({
  _id: _id ? new ObjectId(_id) : new ObjectId(),
  userId: new ObjectId(userId),
  title,
  portfolios,
  description,
  componentType,
  componentData: structureComponentData(componentData),
  isHorizontal
});

export const getSnapshotsByUserId = async (userId) => {
  try {
    const snapshots = Snapshot.find({ userId });
    return await snapshots.lean();
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const create = async (snapshot) => {
  try {
    const { componentData } = snapshot;
    const smartCommentIds = componentData.smartComments.map(s => s.smartCommentId);
    const newSnapshot = await Snapshot.create(structureSnapshot({
      ...snapshot,
      componentData: {
        ...componentData,
        smartComments: await loadSmartComments(smartCommentIds)
      }
    }));
    return newSnapshot;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

const loadSmartComments = async (ids) => {
  const smartComments = await findManyById(ids);
  return smartComments.map(structureSmartComment);
}

export const update = async (snapshotId, snapshot) => {
  try {
    const { componentData } = snapshot;
    const smartCommentIds = componentData.smartComments.map(s => s.smartCommentId);
    const updatedSnapshot = await Snapshot.findOneAndUpdate(
      { _id: new ObjectId(snapshotId) },
      {
        $set: structureSnapshot({
          ...snapshot,
          componentData: {
            ...snapshot.componentData,
            smartComments: await loadSmartComments(smartCommentIds)
          }
        })
      },
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

export const addPortfolioToSnapshot = async (snapshotId, portfolioId) => {
  try {
    const snapshot = await Snapshot.findById(snapshotId);
    if (snapshot?.portfolios?.map(i => i.toString())?.includes(portfolioId)) return snapshotId;
    await Snapshot.findByIdAndUpdate(
      new ObjectId(snapshotId),
      { $push: { portfolios: portfolioId } },
    ).exec();
    return snapshotId;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const removePortfolioFromSnapshot = async (snapshotId, portfolioId) => {
  try {
    await Snapshot.findByIdAndUpdate(
      new ObjectId(snapshotId),
      { $pull: { portfolios: portfolioId } },
    ).exec();
    return snapshotId;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};
