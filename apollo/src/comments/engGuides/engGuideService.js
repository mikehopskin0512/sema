import EngGuide from "./engGuideModel";
import logger from '../../shared/logger';
import errors from '../../shared/errors';

export const getAllEngGuides = async () => {
  try {
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
