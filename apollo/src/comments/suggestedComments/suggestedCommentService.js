import FlexSearch from 'flexsearch';
import commentBank from './commentBank';

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

const reportEvery = Math.floor(commentBank.length / 10);

commentBank.forEach((comment, i) => {
  index.add(i, comment.comment);
  if (i % reportEvery === 0) {
    console.log(`Building comment bank search index: ${i} / ${commentBank.length} done`);
  }
});

const searchComments = async (searchQuery) => {
  const searchResults = await index.search(searchQuery);
  const returnResults = [];
  for (let i = 0; i < 5 && i < searchResults.length; i++) {
    returnResults.push(commentBank[searchResults[i]]);
  }
  return returnResults;
};

module.exports = {
  searchComments,
};
