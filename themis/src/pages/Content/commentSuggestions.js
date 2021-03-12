function suggestReaction(commentText) {
  // return a reaction for the first found instance of one of our keywords
  // any subsequent matching keywords are not checked

  // split on spaces instead of non-alpha
  // we want to include question marks and punctuation
  const words = commentText.split(' '); // commentText.match(/\b(\w+)\b/g);
  let foundReaction = '';

  // Matt want's negative tags anywhere in comment to always suggest a fix
  const negativeTags = ['Unreadable', 'Unsecure', 'Inefficient', 'Inelegant', 'Not reusable', 'Brittle', 'Not maintainable'];
  for (i = 0; i < negativeTags.length && (foundReaction === ''); i++) {
    if (commentText.includes(negativeTags[i])) {
      foundReaction = 'sema_tools';
    }
  }

  for (i = 0;
    i < words.length && (foundReaction === '');
    i++) {
    testWord = words[i].toLowerCase();

    if (testWord.includes('?')
            || testWord.includes('why')) {
      // question mark, why → ❓
      foundReaction = 'sema_question';
    } else if (testWord.includes('change')
            || testWord.includes('bug')
            || testWord.includes('fix')) {
      // change, bug, fix → 🛠️
      foundReaction = 'sema_tools';
    } else if (testWord.includes('good')
                  || testWord.includes('ok')
                  || testWord.includes('works')
                  || testWord.includes('enough')) {
      // good, ok, works, enough → 👌
      foundReaction = 'sema_ok';
    } else if (testWord.includes('excellent')
                  || testWord.includes('great')
                  || testWord.includes('brilliant')
                  || testWord.includes('exemplary')
                  || testWord.includes('awesome')) {
      // excellent, great, brilliant, exemplary, awesome → 🏆
      foundReaction = 'sema_trophy';
    }
  }
  return foundReaction;
  // TODO maybe rework with a state machine
}

function suggestTags(commentText) {
  const foundTags = [];
  const tags = ['Readable', 'Unreadable', 'Secure', 'Unsecure', 'Efficient', 'Inefficient', 'Elegant', 'Inelegant', 'Reusable', 'Not reusable', 'Fault-tolerant', 'Brittle', 'Maintainable', 'Not maintainable'];
  commentTextL = commentText.toLowerCase();
  for (i = 0; i < tags.length; i++) {
    if (commentTextL.includes(tags[i].toLowerCase())) {
      foundTags.push(tags[i]);
    }
  }
  return foundTags;
}

function suggest(commentText) {
  const suggestedReaction = suggestReaction(commentText);
  const suggestedTags = suggestTags(commentText);
  return { suggestedReaction,
    suggestedTags };
}

module.exports.suggest = suggest;

/*
export const TAGS_INIT = [
  {
    [POSITIVE]: 'Readable',
    [NEGATIVE]: 'Unreadable',
    [SELECTED]: null,
  },
  {
    [POSITIVE]: 'Secure',
    [NEGATIVE]: 'Unsecure',
    [SELECTED]: null,
  },
  {
    [POSITIVE]: 'Efficient',
    [NEGATIVE]: 'Inefficient',
    [SELECTED]: null,
  },
  {
    [POSITIVE]: 'Elegant',
    [NEGATIVE]: 'Inelegant',
    [SELECTED]: null,
  },
  {
    [POSITIVE]: 'Reusable',
    [NEGATIVE]: 'Not reusable',
    [SELECTED]: null,
  },
  {
    [POSITIVE]: 'Fault-tolerant',
    [NEGATIVE]: 'Brittle',
    [SELECTED]: null,
  },
  {
    [POSITIVE]: 'Maintainable',
    [NEGATIVE]: 'Not maintainable',
    [SELECTED]: null,
  },
];

export const EMOJIS = [
  {
    title: 'None',
    image: 'sema_none',
    emoji: '⚪',
  },
  {
    title: 'Awesome',
    image: 'sema_trophy',
    emoji: '🏆',
  },
  {
    title: 'Looks good',
    image: 'sema_ok',
    emoji: '👌',
  },
  {
    title: 'I have a question',
    image: 'sema_question',
    emoji: '❓',
  },
  {
    title: 'Fix',
    image: 'sema_tools',
    emoji: '🛠',
  },
];
*/
