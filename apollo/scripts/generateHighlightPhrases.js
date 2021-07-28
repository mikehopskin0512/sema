const sw = require('stopword');
const data = require('../data/suggestedComments.json');

/*

  This script generates hilight phrases for use in the chrome extension.
  The output of this script is placed in:
  ../themis/src/pages/Content/modules/highlightPhrases.js

Approach
 -  - for each comment, pick a highlight ngram that appears less frequently in all comments

Previous approaches that didn't show good results:
 - get all ngrams, count how many times they appear in comments, select shortest, least frequently found ngrams buggy

*/

let allNgramsDupes = [];

function splitByStopWord(text, stopwords) {
  // take a string, try to split by stopword
  // if split found, recurse down into each part to see if we can split further with the rest of the stop words
  // if we can't split the string, then we return it
  let returnTerms = [];
  let splitFound = false;
  for (let i = 0; i < stopwords.length && !splitFound; i += 1) {
    const splitText = text.split(` ${stopwords[i]} `);
    if (splitText.length > 1) {
      splitText.forEach((term) => {
        returnTerms = returnTerms.concat(splitByStopWord(term, stopwords.slice(i)));
      });
      splitFound = true;
    }
  }
  if (splitFound) {
    return returnTerms;
  }
  return [text];
}

data.forEach((comment) => {
  // lets try splitting titles by stopwords
  comment.ngrams = splitByStopWord(comment.title.replace(/[^\w\s]/gi, ' ').replace(/\s\s+/g, ' ').trim(), sw.en.concat(['-', '(', ')', '//']));
  allNgramsDupes = allNgramsDupes.concat(comment.ngrams.slice());
});
const allNgrams = [...new Set(allNgramsDupes)];

// count how many titles the ngram exists in
const ngramCounts = {};
allNgrams.forEach((anNgram) => {
  data.forEach((comment) => {
    if (comment.title.includes(anNgram)) {
      ngramCounts[anNgram] = (ngramCounts[anNgram] || 0) + 1;
    }
  });
});

/* Pick the best highlight term for each comment
 *  - least frequently found
 *  - shortest
 *  - lowest readability ( high complexity ) (TBD)
 *  - least number of generic words ( programming keywords like stackoverflow list ) (TBD)
 */
const highlightTerms = [];
data.forEach((comment) => {
  let foundNgram;
  comment.ngrams.forEach((ngram) => {
    if (!foundNgram) {
      foundNgram = { ngram, ngramCount: ngramCounts[ngram] };
    } else if (ngramCounts[ngram] < foundNgram.ngramCount) {
      foundNgram = { ngram, ngramCount: ngramCounts[ngram] };
    } else if (ngramCounts[ngram] === foundNgram.ngramCount
             && ngram.length < foundNgram.ngram.length) {
      foundNgram = { ngram, ngramCount: ngramCounts[ngram] };
    }
  });
  highlightTerms.push(foundNgram.ngram);
  // console.log(comment.title + '\n   '+foundNgram['ngram']+' '+foundNgram.ngramCount);
});
console.log(JSON.stringify([...new Set(highlightTerms)]));
