import mongoose from "mongoose";
import Reaction from "./reactionModel";
import logger from '../../shared/logger';
import errors from '../../shared/errors';

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

export const buildReactionsEmptyObject = async () => {
  try {
    const schema = {};
    const reactions = await getAllReactions(); 
    for (const [key, value] of Object.entries(reactions)) {
      schema[reactions[key]['_id']] = 0
    }
    return schema;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export  const incrementReactions = (reactionsObject = {}, reaction) => {
  reactionsObject[reaction] += 1;
  return reactionsObject;
};