import EngGuide from "./engGuideModel";
import logger from '../../shared/logger';
import errors from '../../shared/errors';

export const getAllEngGuides = async () => {
  try {
    // const engGuides = await EngGuide.find()
    //   .populate('collections', '_id name description')
    //   .populate({
    //     path: 'tags.tag',
    //     model: 'Tag'
    //   })
    //   .exec();
    const engGuides = await EngGuide.aggregate([
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

export const create = async (engGuide) => {
  try {
    const {
      displayId, title, slug, body, author,
      source,
      collections,
      tags,
    } = engGuide;
    const newEngGuide = new EngGuide({
      displayId, 
      title, 
      slug, 
      body, 
      author,
      source,
      collections,
      tags,
    });
    const savedEngGuide = await newEngGuide.save();
    return savedEngGuide;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
}

export const findBySlug = async (slug) => {
  try {
    const query = Repositories.find({ slug });
    const engGuide = await query.exec();

    return engGuide;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
}