import $ from 'cash-dom';

import { EMOJIS, TAGS_INIT, POSITIVE, NEGATIVE, SELECTED } from '../constants';

export const isTextBox = (element) => {
  var tagName = element.tagName.toLowerCase();
  if (tagName === 'textarea') return true;
  // if (tagName !== 'input') return false;
  // var type = element.getAttribute('type').toLowerCase(),
  //   // if any of these input types is not supported by a browser, it will behave as input type text.
  //   inputTypes = [
  //     'text',
  //     'password',
  //     'number',
  //     'email',
  //     'tel',
  //     'url',
  //     'search',
  //     'date',
  //     'datetime',
  //     'datetime-local',
  //     'time',
  //     'month',
  //     'week',
  //   ];
  // return inputTypes.indexOf(type) >= 0;
  return false;
};

export const isValidSemaTextBox = (element) => {
  const parent = $(element).parents('file-attachment');
  const fileHeaderSibling =
    parent.length && $(parent).siblings('.comment-form-head');
  return isTextBox(element) && fileHeaderSibling.length;
};

export const getSemaGithubText = (selectedEmojiString, selectedTagsString) =>
  `\n**Sema Reaction:** ${selectedEmojiString} | **Sema Tags:**${selectedTagsString}\n`;

export const getInitialSemaValues = (textbox) => {
  const value = textbox.value;
  let initialReaction = EMOJIS[0];
  let initialTags = TAGS_INIT;
  let githubEmoji, selectedTags;
  if (value.includes('Sema Reaction')) {
    const reaction = '**Sema Reaction:** ';
    const reactionStart = value.indexOf(reaction) + reaction.length;
    const reactionEnd = value.indexOf('|') - 1;
    const reactionStr = value.substring(reactionStart, reactionEnd);
    githubEmoji = reactionStr.substring(1, reactionStr.lastIndexOf(':'));

    const tags = '**Sema Tags:** ';
    const tagsStart = value.indexOf(tags) + tags.length;
    selectedTags = value
      .substring(tagsStart)
      .trim()
      .split(',')
      .map((tag) => tag.trim());
  }
  if (githubEmoji?.trim()) {
    const emojiObj = EMOJIS.find(
      (emoji) => emoji.github_emoji === `:${githubEmoji}:`
    );
    if (emojiObj) {
      initialReaction = emojiObj;
    }
  }
  if (selectedTags && Array.isArray(selectedTags) && selectedTags.length) {
    initialTags = TAGS_INIT.map((tagObj) => {
      const positiveTag = tagObj[POSITIVE];
      const negativeTag = tagObj[NEGATIVE];
      let selected = tagObj[SELECTED];

      const selectedTag = selectedTags.find(
        (tag) => tag === positiveTag || tag === negativeTag
      );
      if (selectedTag) {
        selected = selectedTag === positiveTag ? POSITIVE : NEGATIVE;
      }
      return {
        [POSITIVE]: positiveTag,
        [NEGATIVE]: negativeTag,
        [SELECTED]: selected,
      };
    });
  }
  return { initialReaction, initialTags };
};
