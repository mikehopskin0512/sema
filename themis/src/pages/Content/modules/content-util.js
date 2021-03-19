import $ from 'cash-dom';

import {
  EMOJIS,
  TAGS_INIT,
  POSITIVE,
  NEGATIVE,
  SELECTED,
  DELETE_OP,
  SEMA_GITHUB_REGEX,
  SEMABAR_CLASS,
} from '../constants';

import { suggest } from './commentSuggestions';

import { closeAllDropdowns, updateSelectedEmoji } from './redux/action';

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

export function onGithubSubmitClicked(event) {
  const target = event.target;
  const parentButton = $(target).parents('button')?.[0];
  const isButton = $(target).is('button') || $(parentButton).is('button');
  const isSubmitButton =
    isButton &&
    ($(target).attr('type') === 'submit' ||
      $(parentButton).attr('type') === 'submit');

  if (isSubmitButton) {
    const formParent = $(target).parents('form')?.[0];
    const textarea = $(formParent).find(
      'file-attachment div text-expander textarea'
    )?.[0];

    if (textarea) {
      const semabar = $(textarea).siblings('div.sema')?.[0];
      const semaChildren = $(semabar).children();

      const emojiContainer = semaChildren?.[0];
      const tagContainer = semaChildren?.[1];

      const selectedReaction = $(emojiContainer).children()?.[0]?.textContent;
      const selectedTags = $(tagContainer)
        .children('.sema-tag')
        .map((index, tagElement) => tagElement?.textContent);

      const selectedEmojiObj = EMOJIS.find((emoji) =>
        selectedReaction?.includes(emoji.title)
      );

      const selectedEmojiString = `${selectedEmojiObj?.github_emoji} ${selectedEmojiObj?.title}`;

      let selectedTagsString = '';
      selectedTags.each((index, tag) => {
        selectedTagsString = `${selectedTagsString}${
          index > 0 ? ',' : ''
        } ${tag}`;
      });
      if (selectedTagsString.length === 0) {
        selectedTagsString = ' None';
      }

      let semaString = getSemaGithubText(
        selectedEmojiString,
        selectedTagsString
      );

      let textboxValue = textarea.value;

      if (textboxValue.includes('Sema Reaction')) {
        // this textbox already has sema text
        // this is an edit
        textboxValue = textboxValue.replace(SEMA_GITHUB_REGEX, '');
      } else {
        semaString = `\n---${semaString}`;
      }

      textarea.value = `${textboxValue}\n${semaString}`;
    }
  }
}

export function onCloseAllModalsClicked(event, store) {
  const target = event.target;
  const parents = $(target).parents('.sema-dropdown');
  if (parents.length) {
    // do nothing
  } else {
    store.dispatch(closeAllDropdowns());
  }
}

export const toggleTagSelection = (operation, tags) => {
  /**
   * {
   * tag: string
   * isSelected: boolean
   * op: toggle | delete
   * }
   */
  const { tag, isSelected, op } = operation;
  let updatedTags;
  if (op === DELETE_OP) {
    updatedTags = tags.map((tagObj) => {
      const modifiedObj = { ...tagObj };
      if (tag === tagObj[POSITIVE] || tag === tagObj[NEGATIVE]) {
        modifiedObj[SELECTED] = null;
      }
      return modifiedObj;
    });
  } else {
    updatedTags = tags.map((tagObj) => {
      const modifiedObj = { ...tagObj };

      // If tag is already selected, set selection to null on toggle
      if (
        isSelected &&
        (tag === tagObj[POSITIVE] || tag === tagObj[NEGATIVE])
      ) {
        modifiedObj[SELECTED] = null;
        return modifiedObj;
      }

      // Otherwise, set positive or negative tag for selection
      if (tag === tagObj[POSITIVE]) {
        modifiedObj[SELECTED] = POSITIVE;
      } else if (tag === tagObj[NEGATIVE]) {
        modifiedObj[SELECTED] = NEGATIVE;
      }
      return modifiedObj;
    });
  }
  return updatedTags;
};

export function onSuggestion(event, store) {
  const activeElement = document.activeElement;
  const isValid = isValidSemaTextBox(activeElement);
  if (event.code === 'Space' && isValid) {
    const semabarContainer = $(activeElement).siblings(
      `div.${SEMABAR_CLASS}`
    )[0];

    const semabarId = $(semabarContainer).attr('id');

    const payload = suggest(activeElement.value);

    const { suggestedReaction, suggestedTags } = payload;
    if (suggestedReaction || suggestedTags) {
      const state = store.getState();
      const isSemabarDirty = state.semabars[semabarId].isDirty;
      if (!isSemabarDirty) {
        store.dispatch(
          updateSelectedEmoji({
            id: semabarId,
            selectedReaction: suggestedReaction,
          })
        );
      }
    }
    // ({ suggestedReaction, suggestedTags } = payload);

    // if (suggestedReaction || suggestedTags) {
    //   ReactDOM.render(
    //     <Semabar
    //       initialTags={initialTags}
    //       initialReaction={suggestedReaction || initialReaction}
    //     />,
    //     addedSemaElement
    //   );
    // }
  }
}
