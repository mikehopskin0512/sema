const sw = require('stopword');
const data = require('../data/suggestedComments.json');
const commonWords = require('../data/google-10000-english-no-swears.json');
const rs = require('text-readability');

/*

  This script generates hilight phrases for use in the chrome extension.
  The output of this script is placed in:
  ../themis/src/pages/Content/modules/highlightPhrases.js

Approach
 -  - for each comment, pick a highlight ngram that appears less frequently in all comments

Previous approaches that didn't show good results:
 - get all ngrams, count how many times they appear in comments, select shortest, least frequently found ngrams buggy

*/

data.map((comment) => {
  comment.lowerTitle = comment.title.toLowerCase().trim();
});

let allNgramsDupes = [];

function splitByStopWord(text, stopwords) {
  // take a string, try to split by stopword
  // if split found, recurse down into each part to see if we can split further with the rest of the stop words
  // if we can't split the string, then we return it
  let returnTerms = [];
  let splitFound = false;
  for (let i = 0; i < stopwords.length && !splitFound; i += 1) {
    const splitText = text.split(`${stopwords[i]}`);
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
  const stopwordsWithSpaces = sw.en.map(s => ' '+s+' ');
  comment.ngrams = splitByStopWord(comment.lowerTitle.trim(), stopwordsWithSpaces.concat([
    ':',
    '-',
    '(',
    ')',
    '/',
    ',',
    '(^|\s)\'(^|\s)', // this splits things like don't
    '.',
    '+',
    '=',
    '>',
    '<',
    '(^|\s)are(^|\s)',
    '(^|\s)your(^|\s)',
    '(^|\s)you(^|\s)',
    '(^|\s)their(^|\s)',
    '(^|\s)the(^|\s)',
    '(^|\s)him(^|\s)',
    '(^|\s)a(^|\s)',
    '(^|\s)is(^|\s)']));
  allNgramsDupes = allNgramsDupes.concat(comment.ngrams.slice());
});
const allNgrams = [...new Set(allNgramsDupes)];

// count how many titles the ngram exists in
const ngramCounts = {};
allNgrams.forEach((anNgram) => {
  data.forEach((comment) => {
    if (comment.lowerTitle.includes(anNgram)) {
      ngramCounts[anNgram] = (ngramCounts[anNgram] || 0) + 1;
    }
  });
});

/* Pick the best highlight term for each comment
 *  - least frequently found
 *  - shortest
 *  - lowest readability ( high complexity ) (TBD)
 *  - least number of generic words ( programming keywords like stackoverflow list ) (TBD)
 *
 * We are manually trying to model this problem, maybe take some data
 *
 */
const highlightTerms = [];
data.forEach((comment) => {
  let foundNgram;
  comment.ngrams.forEach((ngram) => {
    const fre = rs.fleschReadingEase(ngram);

    let commonWordCount=0;
    commonWords.map((commonWord)=>{
      const matches = ngram.match(`(^|\s)${commonWord}(\s|$)`);
      if( matches && matches.length > 0) {
        //console.log(matches);
        commonWordCount += 1;
      }
    });

    let sscore = (1 + fre) * (1 + ngram.length) * (1 + commonWordCount); // the shorter more complex, the higher score, less common
    if (!foundNgram) { // we haven't found anything
      foundNgram = { ngram, ngramCount: ngramCounts[ngram], score: sscore };
    } else if (ngramCounts[ngram] < foundNgram.ngramCount) { // we found something rare
      foundNgram = { ngram, ngramCount: ngramCounts[ngram], score: sscore };
    } else if (ngramCounts[ngram] === foundNgram.ngramCount // we found something equally as rare, but shorter in length
               && ngram.score < foundNgram.ngram.score) {
      foundNgram = { ngram, ngramCount: ngramCounts[ngram], score: sscore };
    }
  });
  highlightTerms.push(foundNgram.ngram.trim().replace(/^'|'$/g, '').trim());
  // console.log(comment.lowerTitle + '\n   '+foundNgram['ngram']+' '+foundNgram.ngramCount);
});

process.stdout.write('const phrases = ');
console.dir([...new Set(highlightTerms)].sort(), { maxArrayLength: null });
console.log('export default phrases;');
