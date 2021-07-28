const sw = require('stopword');
//console.log(sw.en);
const data = require('../data/suggestedComments.json');

//console.log('starting');

/*
Approach
 -  - for each comment, pick a highlight ngram that appears less frequently in all comments

Previous approaches that didn't show good results:
 - get all ngrams, count how many times they appear in comments, select shortest, least frequently found ngrams buggy

*/

let allNgramsDupes = [];

function generateNgramsWithoutStopwords(comment){ // old approach
    const highlightsForComment = [];
    const commentParts = comment.title.replace(/[^\w\s]/gi, '').trim().split(' ');
    // Generate ngrams excluding stop words
  for (let j = 0; j < commentParts.length; j++) {
    for (let k = 0; k < commentParts.length; k++) {
      const newNgram = commentParts.slice(j, j + k + 1);
      const commentTitleWithoutStop = sw.removeStopwords(newNgram);
      if (commentTitleWithoutStop.length === newNgram.length) {
        highlightsForComment.push(newNgram.join(' ').trim());
      }
    }
  }
  const highlightsForCommentNoDupes = [...new Set(highlightsForComment)];
  return highlightsForCommentNoDupes;
}

function splitByStopWord(text, stopwords){
  // take a string, try to split by stopword
  // if split found, recurse down into each part to see if we can split further with the rest of the stop words
  // if we can't split the string, then we return it
  let returnTerms = [];
  let splitFound=false;
  for(let i=0; i < stopwords.length && !splitFound ; i=i+1){
    const splitText = text.split(' '+stopwords[i]+' ');
    if(splitText.length>1){
      splitText.forEach((term)=>{
        returnTerms = returnTerms.concat(splitByStopWord(term, stopwords.slice(i)));
      });
      splitFound = true;
    }
  }
  if(splitFound){
    return returnTerms;
  }else{
    return [ text ];
  }
}

// split each comment title into ngrams of variable length
data.forEach((comment) => {
  // const highlightsForComment = generateNgramsWithoutStopwords(comment);
  // allNgramsDupes = allNgramsDupes.concat(highlightsForComment.slice());
  // comment.ngrams = highlightsForComment;

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
 *  - lowest readability ( high complexity )
 *  - least number of generic words ( programming keywords like stackoverflow list )
 */
const highlightTerms = [];
data.forEach((comment)=> {
  let foundNgram;
  comment.ngrams.forEach((ngram)=>{
    if (!foundNgram) {
      foundNgram = { 'ngram':ngram, 'ngramCount': ngramCounts[ngram] };
    }else if(ngramCounts[ngram] < foundNgram.ngramCount) {
      foundNgram = { 'ngram':ngram, 'ngramCount': ngramCounts[ngram] };
    }else if(ngramCounts[ngram] === foundNgram.ngramCount
             && ngram.length < foundNgram.ngram.length){
      foundNgram = { 'ngram':ngram, 'ngramCount': ngramCounts[ngram] };
    }
  });
  highlightTerms.push(foundNgram.ngram);
  //console.log(comment.title + '\n   '+foundNgram['ngram']+' '+foundNgram.ngramCount);
});
console.log(JSON.stringify([...new Set(highlightTerms)]));



/*
// get ngrams that appear in less than 5 comments
const ngramsInfreq = [];
for (const k in ngramCounts) {
  if (ngramCounts[k] < 5) {
    ngramsInfreq.push(k);
  }
}
console.log(`${ngramsInfreq.length} infrequently found terms (<5)`);

// find comments that have no highlighted text
console.log(`\nMissing highlight terms for comments   >>> `);
const commentsWithoutHighlights = [];
data.forEach((comment) => {
  // we lose a few
  const ngramsInComment = [];
  ngramsInfreq.forEach((ngram) => {
    if (comment.title.includes(ngram)) {
      ngramsInComment.push(ngram);
    }
  });
  if (ngramsInComment.length < 1) {
      console.log('    ' + comment.title);
      commentsWithoutHighlights.push(comment);
  }
});
console.log(`Missing highlight terms for ${commentsWithoutHighlights.length} comments ^^^ `);
*/
