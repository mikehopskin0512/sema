/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import {
  EMOJIS, REQUEST_DEFAULT_HEADERS, SUMMARIES_SUGGESTIONS_URL, TAGS_KEYS, TAGS_SUGGESTIONS_URL,
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
  for (const matchTerm of matchTerms) {
    checkTerm(commentText, matchTerm, reactionBallot);
  }
}

async function suggestReaction(originalCommentText) {
  const commentText = originalCommentText.toLowerCase();
  try {
    const response = await fetch(SUMMARIES_SUGGESTIONS_URL, {
      headers: REQUEST_DEFAULT_HEADERS,
      method: 'POST',
      body: JSON.stringify({ comments: commentText })
    });

    const data = await response.json();
    const suggestion = data.hard_labels[0][0];

    return EMOJIS.find(i => i.key === suggestion) ?? EMOJIS[0];
  } catch {
    return []
  }
}

const mapTagToValue = (tags) => tags.map(tag => TAGS_KEYS[tag.toUpperCase()]).filter(i => !!i);

async function suggestTags(originalCommentText) {
  const commentText = originalCommentText.toLowerCase();

  try {
    const response = await fetch(TAGS_SUGGESTIONS_URL, {
      headers: REQUEST_DEFAULT_HEADERS,
      method: 'POST',
      body: JSON.stringify({ comments: commentText })
    });

    const data = await response.json();
    const tags = data.hard_labels[0] ?? [];

    return mapTagToValue(tags);
  } catch {
    return []
  }
}

export default async function suggest(commentText) {
  const [suggestedReaction, suggestedTags] = await Promise.all([suggestReaction(commentText), suggestTags(commentText)]);
  return { suggestedReaction, suggestedTags };
}
