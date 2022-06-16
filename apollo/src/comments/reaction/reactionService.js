import Reaction from './reactionModel';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import escapeRegExp from '../../shared/escape';

export const getAllReactions = async () => {
  try {
    const reactions = await Reaction.find().exec();
    return reactions;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getReactionIdKeys = async () => {
  try {
    const reactions = await getAllReactions();
    const reactionKeys = reactions.map((r) => r._id);
    const keys = reactionKeys.reduce((a, b) => ({ ...a, [b]: 0 }), {});
    return keys;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findOneByTitle = async (title) => {
  const regexp = new RegExp(`^${escapeRegExp(title)}$`, 'i');
  return await Reaction.findOne({ title: regexp, isActive: true });
};

export const findById = async (_id) =>
  await Reaction.findOne({ _id, isActive: true });
