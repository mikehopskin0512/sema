/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import {
  NEGATIVE, POSITIVE, TAGS_INIT, EMOJIS,
} from '../constants';

function checkTerm(commentText, matchTerm, reactionBallot) {
  let startIndex = 0;
  let foundIndex = commentText.indexOf(matchTerm); // find first occurance
  while (foundIndex >= startIndex) {
    reactionBallot.count += 1; // we have found an occurance which counts as a vote
    if (foundIndex >= reactionBallot.lastFoundIndex) { // if we found an occurance further along in the string, then record its location
      reactionBallot.lastFoundIndex = foundIndex;
    }
    // we now want to search the rest of the string, starting from after the occurance
    startIndex = foundIndex + matchTerm.length;
    foundIndex = startIndex + commentText.substr(startIndex).indexOf(matchTerm);
    // if we find a second occurance, then it will be further along in the comment from where we started the second search
  }
}

function checkTerms(commentText, matchTerms, reactionBallot) {
  // eslint-disable-next-line no-restricted-syntax
  for (const matchTerm of matchTerms) {
    checkTerm(commentText, matchTerm, reactionBallot);
  }
}

function suggestReaction(originalCommentText) {
  const commentText = originalCommentText.toLowerCase();

  /*  Current approach:
   *    count the number of occurances of keywords for each emoji
   *    highest count wins, but last found wins in tie-breaker
   *    this will recalculate even if you edit text mid-comment
   *    this implementation is very very prone to off-by-one errors :(
   */

  /*  Other approaches:
   *    - return last found reaction, do not check any others
   *      reverse all strings, start from the end
   *      would be so much simpler to edit old approach
   *
   *  Old approach
   *    return a reaction for the first found instance of one of our keywords, any subsequent matching keywords are not checked
   */

  const reactionBallots = [];
  for (let i = 0; i < EMOJIS.length; i += 1) {
    // we will find how many occurances of each keyword there are
    // and the location where each keyword was found furthest into the comment ( closest to the end of the comment )
    // in the event of a tie, the keyword found closest to the end of the comment will win
    reactionBallots.push({ count: 0, lastFoundIndex: 0 });
  }

  // excellent, great, brilliant, exemplary, awesome → 🏆
  const trophyWords = ['excellent', 'great', 'brilliant', 'exemplary', 'awesome'];
  checkTerms(commentText, trophyWords, reactionBallots[1]);

  // good, ok, works, enough → 👌
  const okWords = ['good', 'ok', 'works', 'enough'];
  checkTerms(commentText, okWords, reactionBallots[2]);

  // question mark, why → ❓
  checkTerms(commentText, ['why', '?'], reactionBallots[3]);

  // Matt want's negative tags anywhere in comment to suggest fix
  // change, bug, fix → 🛠️
  const fixWords = [
    'unreadable',
    'not secure',
    'inefficient',
    'inelegant',
    'not reusable',
    'brittle',
    'not maintainable',
    'change',
    'bug',
    'fix',
  ];
  checkTerms(commentText, fixWords, reactionBallots[4]);

  let reactionWinners = [0];
  for (let i = 0, highestCount = 0; i < reactionBallots.length; i += 1) {
    // if there are no occurances, then stay on the first null state, if there are tied counts above 0, then pick the last found
    if (reactionBallots[i].count > highestCount) {
      reactionWinners = [i];
      highestCount = reactionBallots[i].count;
    } else if (reactionBallots[i].count > 0 && reactionBallots[i].count === highestCount) {
      // we might have a draw, add it to list of winners
      reactionWinners.push(i);
    }
  }

  let winnerIndex = 0;
  let latestFoundIndex = 0;
  // go through the winners, pick the winner found closest to the end of the comment
  // eslint-disable-next-line no-restricted-syntax
  for (const reactionIndex of reactionWinners) {
    if (reactionBallots[reactionIndex].lastFoundIndex >= latestFoundIndex) {
      winnerIndex = reactionIndex;
      latestFoundIndex = reactionBallots[reactionIndex].lastFoundIndex; // someone help :(
    }
  }
  return EMOJIS[winnerIndex];
}

function suggestTags(commentText) {
  const foundTags = [];
  const commentTextL = commentText.toLowerCase();
  // eslint-disable-next-line no-restricted-syntax
  for (const tagPair of TAGS_INIT) {
    if (commentTextL.includes(tagPair[NEGATIVE].toLowerCase())) {
      foundTags.push(tagPair[NEGATIVE]);
    } else if (commentTextL.includes(tagPair[POSITIVE].toLowerCase())) {
      foundTags.push(tagPair[POSITIVE]);
    }
  }
  return foundTags;
}

export default function suggest(commentText) {
  const suggestedReaction = suggestReaction(commentText);
  const suggestedTags = suggestTags(commentText);
  return { suggestedReaction, suggestedTags };
}
