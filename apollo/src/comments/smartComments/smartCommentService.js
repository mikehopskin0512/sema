import logger from '../../shared/logger';
import errors from '../../shared/errors';
import SmartComment from './smartCommentModel';

export const create = async ({
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

export const filterSmartComments = async ({ reviewer, author, repoId }) => {
  try {
    let filter = {}

    if (reviewer) {
      filter = Object.assign(filter, { "githubMetadata.user.login": reviewer });
    }
    if (author) {
      filter = Object.assign(filter, { "githubMetadata.requester": author });
    }
    if (repoId) {
      filter = Object.assign(filter, { "githubMetadata.repo_id": repoId });
    }

    const comments = await SmartComment.find(filter);
    return comments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const findByReviewer = async (reviewerId, repoId) => {
  try {
    const comments = await SmartComment.find({ "githubMetadata.user.id": reviewerId });
    return comments;

  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const findByAuthor = async (author, repoId) => {
  try {
    const comments = await SmartComment.find({ "githubMetadata.requester": author });
    return comments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};

export const findByExternalId = async (repoId) => {
  try {
    const comments = await SmartComment.find({ "githubMetadata.repo_id": repoId });
    return comments;
  } catch (err) {
    const error = new errors.BadRequest(err);
    logger.error(error);
    throw (error);
  }
};