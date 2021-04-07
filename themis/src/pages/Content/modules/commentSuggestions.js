import { EMOJIS } from '../constants';

function suggestReaction(commentText) {
  // return a reaction for the first found instance of one of our keywords
  // any subsequent matching keywords are not checked

  // split on spaces instead of non-alpha
  // we want to include question marks and punctuation
  const words = commentText.split(' '); // commentText.match(/\b(\w+)\b/g);
  let foundReaction = '';

  // Matt want's negative tags anywhere in comment to always suggest a fix
  const negativeTags = [
    'Unreadable',
    'Unsecure',
    'Inefficient',
    'Inelegant',
    'Not reusable',
    'Brittle',
    'Not maintainable',
  ];
  for (let i = 0; i < negativeTags.length && foundReaction === ''; i++) {
    if (commentText.includes(negativeTags[i])) {
      foundReaction = EMOJIS[4];
    }
  }

  for (let i = 0; i < words.length && foundReaction === ''; i++) {
    const testWord = words[i].toLowerCase();

    if (testWord.includes('?') || testWord.includes('why')) {
      // question mark, why → ❓
      foundReaction = EMOJIS[3];
    } else if (
      testWord.includes('change') ||
      testWord.includes('bug') ||
      testWord.includes('fix')
    ) {
      // change, bug, fix → 🛠️
      foundReaction = EMOJIS[4];
    } else if (
      testWord.includes('good') ||
      testWord.includes('ok') ||
      testWord.includes('works') ||
      testWord.includes('enough')
    ) {
      // good, ok, works, enough → 👌
      foundReaction = EMOJIS[2];
    } else if (
      testWord.includes('excellent') ||
      testWord.includes('great') ||
      testWord.includes('brilliant') ||
      testWord.includes('exemplary') ||
      testWord.includes('awesome')
    ) {
      // excellent, great, brilliant, exemplary, awesome → 🏆
      foundReaction = EMOJIS[1];
    }
  }
  return foundReaction;
  // TODO maybe rework with a state machine
}

function suggestTags(commentText) {
  const foundTags = [];
  const tags = [
    'Readable',
    'Unreadable',
    'Secure',
    'Unsecure',
    'Efficient',
    'Inefficient',
    'Elegant',
    'Inelegant',
    'Reusable',
    'Not reusable',
    'Fault-tolerant',
    'Brittle',
    'Maintainable',
    'Not maintainable',
  ];
  const commentTextL = commentText.toLowerCase();
  for (let i = 0; i < tags.length; i++) {
    if (commentTextL.includes(tags[i].toLowerCase())) {
      foundTags.push(tags[i]);
    }
  }
  return foundTags;
}

export function suggest(commentText) {
  const suggestedReaction = suggestReaction(commentText);
  const suggestedTags = suggestTags(commentText);
  return { suggestedReaction, suggestedTags };
}
