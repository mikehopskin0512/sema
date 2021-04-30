import FlexSearch from 'flexsearch';
import SuggestedComment from './suggestedCommentModel';
import Query from '../queryModel';
import errors from '../../shared/errors';
import logger from '../../shared/logger';

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

const buildSuggestedCommentsIndex = async () => {
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
      id: commentItem._id,
      comment: commentItem.comment,
      title: commentItem.title,
      sourceUrl: commentItem.sourceUrl,
      sourceName: commentItem.sourceName,
    });
  }

  // store the search case to database
  const newQuery = new Query({
    searchTerm: searchQuery,
    matchedCount: searchResults.length,
  });
  await newQuery.save();

  return {
    query: {
      id: newQuery._id,
      searchTerm: newQuery.searchTerm,
    },
    result: returnResults,
  };
};

module.exports = {
  buildSuggestedCommentsIndex,
  searchComments,
};
