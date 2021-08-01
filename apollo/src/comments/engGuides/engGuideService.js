import EngGuide from "./engGuideModel";
import logger from '../../shared/logger';
import errors from '../../shared/errors';

export const getAllEngGuides = async () => {
  try {
    const engGuides = await EngGuide.find().populate('collections', '_id name description').exec();
    return engGuides;
  } catch (err) {
    logger.error(err);
    const error = new errors.NotFound(err);
    return error;
  }
};