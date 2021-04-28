import logger from '../../shared/logger';
import errors from '../../shared/errors';
import SmartComment from './smartCommentModel';

const create = async ({ comment = null, suggestedComments = null, reaction = null, tags = null }) => {
  try {
    const smartComment = new SmartComment();
    smartComment.comment = comment;
    smartComment.suggestedComments = suggestedComments;
    smartComment.reaction = reaction;
    smartComment.tags = tags;
    const savedSmartComment = await smartComment.save();
    return savedSmartComment;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw error;
  }
};

module.exports = {
  create,
};
