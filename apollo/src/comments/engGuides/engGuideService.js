import mongoose from 'mongoose';
import EngGuide from './engGuideModel';
import logger from '../../shared/logger';
import errors from '../../shared/errors';
import { fullName } from '../../shared/utils';
import { create as createTags, findTags } from '../tags/tagService';

const { Types: { ObjectId } } = mongoose;

export const getAllEngGuides = async (params) => {
  try {
    const engGuides = await EngGuide.aggregate([
      ...(params && params.guides) ? [{
        $match: { $expr: { $in: ['$_id', params.guides.map((i) => ObjectId(i))] } },
      }] : [],
      {
        $lookup: {
          from: 'collections',
          as: 'collections',
          foreignField: '_id',
          localField: 'collections'
        }
      },
      {
        $lookup: {
          from: 'tags',
          as: 'tags',
          foreignField: '_id',
          localField: 'tags.tag'
        }
      },
      {
        $project: {
          'collections.tags': 0,
          'collections.comments': 0,
        }
      }
    ]);
    return engGuides;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};

const makeTagsList = async (tags) => {
  const { existingTags, newTags } = tags;
  let savedTags = [];
  if (newTags && newTags.length > 0) {
    savedTags = await createTags(newTags);
  }
  const existingTagsArr = await findTags(existingTags.map((id) => ObjectId(id)));
  const suggestedCommentTags = [...existingTagsArr, ...savedTags].map((item) => ({
    label: item.label,
    type: item.type,
    tag: ObjectId(item._id),
  }));
  return suggestedCommentTags;
};

export const bulkCreateEngGuides = async (engGuides, user) => {
  const guides = await Promise.all(engGuides.map(async (guide) => ({
    ...guide,
    tags: await makeTagsList(guide.tags),
    author: fullName(user.user),
  })));

  const result = await EngGuide.create(guides);
  return result;
};

export const bulkUpdateEngGuides = async (engGuides) => {
  const guides = await Promise.all(engGuides.map(async (guide) => ({
    ...guide,
    ...guide.tags ? { tags: await makeTagsList(guide.tags) } : {},
  })));

  const result = await Promise.all(guides.map(async (item) => {
    await EngGuide.updateOne({ _id: item._id }, { $set: { ...item } });
    return true;
  }));
  return result;
};
