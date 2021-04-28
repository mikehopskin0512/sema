import FlexSearch from 'flexsearch';
import SmartComment from './smartCommentModel';
import SuggestedComment from './suggestedCommentModel';
import errors from '../shared/errors';
import logger from '../shared/logger';

const index = new FlexSearch({
  encode: 'balance',
  tokenize: 'full',
  threshold: 0,
  depth: 5,
  async: true,
  worker: 1,
  cache: true,
  stemmer: 'en',
});

const indexComments = async () => {
  try {
    const dbComments = await SuggestedComment.find({});
    const reportEvery = Math.floor(dbComments.length / 10);

    dbComments.forEach((comment, i) => {
      // index by MongoDB ID
      index.add(comment._id, comment.comment);
      if (i % reportEvery === 0) {
        logger.info(`Building comment bank search index: ${i} / ${dbComments.length} done`);
      }
    });
  } catch (err) {
    const error = new errors.InternalServer(err);
    logger.error(error);
    throw error;
  }
};

const searchComments = async (searchQuery) => {
  const searchResults = await index.search(searchQuery);
  const returnResults = [];
  for (let i = 0; i < 5 && i < searchResults.length; i++) {
    const commentItem = await SuggestedComment.findById(searchResults[i]);
    returnResults.push({
      comment: commentItem.comment,
      title: commentItem.title,
      sourceUrl: commentItem.sourceUrl,
      sourceName: commentItem.sourceName,
    });
  }
  return returnResults;
};

const create = async ({
  comment = null,
  suggestedComments = null,
  reaction = null,
  tags = null,
  githubMetada = null,
}) => {
  try {
    const smartComment = new SmartComment();
    smartComment.comment = comment;
    smartComment.suggestedComments = suggestedComments;
    smartComment.reaction = reaction;
    smartComment.tags = tags;
    smartComment.githubMetada = githubMetada;
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
  indexComments,
  searchComments,
};
