import mongoose from 'mongoose';
import { PORTFOLIO_TYPES } from './constants';
import Portfolio from './portfolioModel';
import logger from '../shared/logger';
import errors from '../shared/errors';

const { Types: { ObjectId } } = mongoose;

const structurePortfolio = ({
  _id = null, userId = null, firstName = null, lastName = null, identities = [],
  headline = null, imageUrl = null, overview = null, type = PORTFOLIO_TYPES.PRIVATE, snapshots = [], title = null,
  layout = []
}) => {
  const userAvatarUrl = identities.length && identities[0].avatarUrl;
  const portfolioAvatarUrl = imageUrl || userAvatarUrl;
  return {
    _id: new ObjectId(_id),
    userId: new ObjectId(userId),
    firstName,
    lastName,
    headline,
    imageUrl: portfolioAvatarUrl,
    identities,
    overview,
    type,
    title,
    layout,
    snapshots: snapshots.map(({ id: snapshot, sort }) => ({ id: new ObjectId(snapshot._id), sort })),
  }
};

export const create = async (portfolio) => {
  try {
    const newPortfolio = new Portfolio(structurePortfolio(portfolio));
    return newPortfolio.save();
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
        populate: [
          {
            path: 'componentData.smartComments.tags',
            model: 'Tag',
          },
          {
            path: 'componentData.smartComments.userId',
            model: 'User',
            select: ['firstName', 'lastName', 'username', 'avatarUrl'],
          },
        ],
      });
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
        populate: [
          {
            path: 'componentData.smartComments.tags',
            model: 'Tag',
          },
          {
            path: 'componentData.smartComments.userId',
            model: 'User',
          }
        ]
      })
      .exec();
    return updatedPortfolio;
  } catch (err) {
    const error = new errors.NotFound(err);
    logger.error(error);
    throw error;
  }
};

export const updateField = async (id, field, value) => {
  try {
    await Portfolio
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { [field]: value } },
        { new: true },
      )
      .exec();
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
        populate: [
          {
            path: 'componentData.smartComments.tags',
            model: 'Tag',
          },
          {
            path: 'componentData.smartComments.userId',
            model: 'User',
            select: ['firstName', 'lastName', 'username', 'avatarUrl'],
          },
        ],
      });
    }
    return await portfolio.lean();
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const addSnapshotsToPortfolio = async (portfolioId, snapshotIds) => {
  try {
    const portfolio = await getPortfolioById(portfolioId, false);

    const portfolioSnaps = portfolio.snapshots?.map(i => i.id.toString())

    const portfolioSnapshots = portfolio.snapshots?.map(({ id, sort }) => (
      { id, sort: sort + snapshotIds.length }
    ));

    const snapshots = [
      // To exclude duplicates
      ...snapshotIds.filter(snap => !portfolioSnaps?.includes(snap))?.map((id, sort) => ({ id, sort })),
      ...portfolioSnapshots,
    ];

    await Portfolio.findOneAndUpdate(
      { _id: new ObjectId(portfolioId) },
      { $set: { snapshots } },
    ).exec();

    return getPortfolioById(portfolioId);
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

export const removeSnapshotFromPortfolio = async (portfolioId, snapshotId) => {
  try {
    const portfolio = await getPortfolioById(portfolioId, false);
    const snapshots = portfolio.snapshots.filter((s) => s.id.toString() !== snapshotId);
    // TODO: populate should be deleted here
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { _id: new ObjectId(portfolioId) },
      { $set: { snapshots } },
      { new: true },
    ).populate({
      path: 'snapshots.id',
      populate: [
        {
          path: 'componentData.smartComments.tags',
          model: 'Tag',
        },
        {
          path: 'componentData.smartComments.userId',
          model: 'User',
        },
      ],
    }).exec();
    return updatedPortfolio;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};
