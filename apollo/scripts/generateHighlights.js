sw = require('stopword');
const data = require('../data/suggestedComments.json');

console.log('starting');

/*
Approaches

 - get all ngrams, count how many times they appear in comments, select shortest, least frequently found ngrams

 - for each comment, pick a highlight ngram that appears less frequently in all comments

*/

const allNgramsDupes = [];

// split each comment title into ngrams of variable length
data.forEach((comment, i) => {
  const commentParts = comment.title.trim().split(' ');
  for (let j = 0; j < commentParts.length; j++) {
    for (let k = 0; k < commentParts.length; k++) {
      const newNgram = commentParts.slice(j, j + k + 1);
      const commentTitleWithoutStop = sw.removeStopwords(newNgram);
      if (commentTitleWithoutStop.length === newNgram.length) {
        allNgramsDupes.push(newNgram.join(' ').trim());
      }
    }
  }
});
const allNgrams = [...new Set(allNgramsDupes)];
console.log(`${allNgrams.length} unique ngrams found`);

/*
data.forEach((comment) => {
    if (comment.title.includes('your secret? Mellow jazz? Bongo drums? Huge bag of weed? -Tony Stark (Iron Man)')){
        console.log(comment.title);
    }
});
allNgrams.forEach((ngram) => {
    if (ngram==='your secret? Mellow jazz? Bongo drums? Huge bag of weed? -Tony Stark (Iron Man)'){
        console.log(ngram);
    }
}); */

const ngramCounts = {};
// count how many titles the ngram exists in
allNgrams.forEach((anNgram) => {
  data.forEach((comment) => {
    if (anNgram && anNgram.trim() !== '' && comment.title.includes(anNgram)) {
      ngramCounts[anNgram] = (ngramCounts[anNgram] || 0) + 1;
    }
  });
});

// get ngrams that appear in less than 5 comments
const ngramsInfreq = [];
for (const k in ngramCounts) {
  if (ngramCounts[k] < 5) {
    ngramsInfreq.push(k);
  }
}
console.log(`${ngramsInfreq.length} infrequently found terms (<5)`);

/**/
// find comments that have no highlighted text
console.log(`\nMissing highlight terms for comments   >>> `);
const commentsWithoutHighlights = [];
data.forEach((comment) => {
  // almost every single one
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


// Find the best highlight term for each comment
data.forEach((comment) => {
  const highlightsForComment = [];
  console.log(`\n${comment.title}`);
  allNgrams.forEach((ngram) => {
    if(comment.title.includes(ngram)){
      highlightsForComment.push(ngram);
      console.log(`    ${ngram}`);
    }
  });
});
