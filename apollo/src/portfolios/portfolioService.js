import mongoose from 'mongoose';

import Portfolio from './portfolioModel';
import logger from '../shared/logger';
import errors from '../shared/errors';
import { getSnapshotsByPortfolio } from '../snapshots/snapshotService';

const { Types: { ObjectId } } = mongoose;

const structurePortfolio = ({
  _id = null, userId = null, headline = null, imageUrl = null, overview = null, type = null, snapshots = [],
}) => (
  {
    _id: new ObjectId(_id),
    userId: new ObjectId(userId),
    headline,
    imageUrl,
    overview,
    type,
    snapshots: snapshots.map(({ id, sort }) => ({ id: new ObjectId(id), sort })),
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

export const getPortfoliosByUser = async (userId) => {
  try {
    const portfolios = await Portfolio.find({ userId }).exec();
    return portfolios;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const update = async (portfolioId, portfolio) => {
  try {
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { _id: new ObjectId(portfolioId) },
      { $set: structurePortfolio(portfolio) },
      { new: true },
    ).exec();
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

export const getPortfolioById = async (portfolioId) => {
  try {
    const portfolio = await Portfolio.findById(new ObjectId(portfolioId)).lean();
    return portfolio;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const addSnapshot = async (portfolioId, snapshotId) => {
  try {
    const portfolio = await getPortfolioById(portfolioId);
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
