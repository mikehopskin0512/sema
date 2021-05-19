import logger from '../../shared/logger';
import errors from '../../shared/errors';
import SmartComment from './smartCommentModel';

const create = async ({
  commentId = null,
  comment = null,
  userId = null,
  type = null,
  suggestedComments = null,
  reaction = null,
  tags = null,
  githubMetadata = null,
}) => {
  try {
    const smartComment = new SmartComment();
    smartComment.commentId = commentId;
    smartComment.comment = comment;
    smartComment.userId = userId;
    smartComment.type = type;
    smartComment.suggestedComments = suggestedComments;
    smartComment.reaction = reaction;
    smartComment.tags = tags;
    smartComment.githubMetadata = githubMetadata;
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
