import mongoose from 'mongoose';
import Portfolio from './portfolioModel';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { getSnapshotsByPortfolio } from '../snapshots/snapshotService';

const { Types: { ObjectId } } = mongoose;

const structurePortfolio = ({
  _id = null, userId = null, firstName = null, lastName = null, identities = [],
  headline = null, imageUrl = null, overview = null, type = null, snapshots = [],
}) => (
  {
    _id: new ObjectId(_id),
    userId: new ObjectId(userId),
    firstName,
    lastName,
    headline,
    imageUrl,
    identities,
    overview,
    type,
    snapshots: snapshots.map(({ id: snapshot, sort }) => ({ id: new ObjectId(snapshot._id), sort })),
  }
);

export const create = async (portfolio) => {
  try {
    const newPortfolio = new Portfolio(structurePortfolio(portfolio));
    const savedPortfolio = await newPortfolio.save();
    return savedPortfolio;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const getPortfoliosByUser = async (userId, populate = true) => {
  try {
    const portfolios = Portfolio.find({ userId });
    if (populate) {
      portfolios.populate({
        path: 'snapshots.id',
        populate: {
          path: 'componentData.smartComments.tags',
          model: 'Tag',
        }
      })
    }
    return await portfolios.lean();
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const update = async (portfolioId, portfolio) => {
  try {
    const updatedPortfolio = await Portfolio
      .findOneAndUpdate(
        { _id: new ObjectId(portfolioId) },
        { $set: structurePortfolio(portfolio) },
        { new: true },
      )
      .populate({
        path: 'snapshots.id',
        populate: {
          path: 'componentData.smartComments.tags',
          model: 'Tag',
        }
      })
      .exec();
    return updatedPortfolio;
  } catch (err) {
    const error = new errors.NotFound(err);
    logger.error(error);
    throw error;
  }
};

export const deleteOne = async (portfolioId) => {
  try {
    const deletedPortfolio = await Portfolio.findByIdAndDelete(new ObjectId(portfolioId)).exec();
    return deletedPortfolio;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const getPortfolioById = async (portfolioId, populate = true) => {
  try {
    const portfolio = Portfolio.findById(new ObjectId(portfolioId));
    if (populate) {
      portfolio.populate({
        path: 'snapshots.id',
        populate: {
          path: 'componentData.smartComments.tags',
          model: 'Tag',
        }
      })
    }
    return await portfolio.lean();
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const addSnapshot = async (portfolioId, snapshotId) => {
  try {
    const portfolio = await getPortfolioById(portfolioId, false);
    const snapshots = portfolio.snapshots.map(({ id, sort }) => {
      const position = sort + 1;
      return { id, sort: position };
    });
    snapshots.unshift({ id: snapshotId, sort: 0 });
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { _id: new ObjectId(portfolioId) },
      { $set: { snapshots } },
    ).exec();
    return updatedPortfolio;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const removeSnapshotFromPortfolio = async (portfolioId, snapshotId) => {
  try {
    const portfolio = await getPortfolioById(portfolioId, false);
    const snapshots = portfolio.snapshots.filter((s) => s.id.toString() !== snapshotId)
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { _id: new ObjectId(portfolioId) },
      { $set: { snapshots } },
      { new: true },
    ).populate({
      path: 'snapshots.id',
      populate: {
        path: 'componentData.smartComments.tags',
        model: 'Tag',
      }
    }).exec();
    return updatedPortfolio;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};