import mongoose from "mongoose";
import _ from 'lodash';
import Tag from "./tagModel";
import logger from '../../shared/logger';
import errors from '../../shared/errors';

export const getAllTags = async () => {
  try {
    const tags = await Tag.find({}).exec();
    return tags;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const getTagsByType = async (type) => {
  try {
    const tags = await Tag.find({ type }).exec();
    return tags;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
}

export const getAllTagIds = async () => {
  try {
    const tags = await getAllTags();
    return tags.map((tag) => tag._id);
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findTagsByType = async () => {
  try {
    // const tags = await Tag.find({
    //   "type": {
    //     $in: ["language", "guide", "custom"],
    //   }
    // });
    const tags = await Tag.aggregate([
      {
        $match: {
          "type": {
            $in: ["language", "guide", "custom"],
          }
        }
      },
      {
        $lookup: {
          from: "suggestedComments",
          localField: "_id",
          foreignField: "tags.tag",
          as: "suggestedCommentsForeign"
        },

      },
      {
        $project: {
          _id: 1,
          label: 1,
          type: 1,
          sentiment: 1,
          isActive: 1,
          suggestedCommentsCount: { $size: "$suggestedCommentsForeign" },
        }
      }
    ]).exec()
    return tags;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const findTags = async (tagsArr) => {
  try {
    const tags = await Tag.find({
      "_id": {
        $in: tagsArr,
      }
    }).exec();
    return tags;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};


export const buildTagsEmptyObject = async () => {
  try {
    const schema = {};
    const tags = await getAllTags();
    for (const [key, value] of Object.entries(tags)) {
      schema[tags[key]['_id']] = 0
    }
    return schema;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

export const incrementTags = (tagsObject = {}, tagsArray) => {
  // tagsObject - data from db
  // tagsArray - raw data from smart comments
  const tagsObject2 = {};
  for (const val of tagsArray) {
    tagsObject2[val] = 1;
  }
  const aggregatedTags = _.mergeWith({}, tagsObject, tagsObject2, _.add);
  return aggregatedTags;
};

export const create = async (tags) => {
  try {
    const response = await Tag.insertMany(tags);
    return response;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};