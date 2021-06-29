import logger from '../../shared/logger';
import errors from '../../shared/errors';
import SmartComment from './smartCommentModel';

const create = async ({
  commentId = null,
  comment = null,
  userId = null,
  location = null,
  suggestedComments = null,
  reaction = null,
  tags = null,
  githubMetadata = null,
}) => {
  try {
    const smartComment = new SmartComment({
      commentId,
      comment,
      userId,
      location,
      suggestedComments,
      reaction,
      tags,
      githubMetadata,
    });
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
