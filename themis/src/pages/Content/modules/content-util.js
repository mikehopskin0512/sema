import $ from 'cash-dom';

import {
  USER,
  EMOJIS,
  TAGS_INIT,
  TAGS_ON_DB,
  POSITIVE,
  NEGATIVE,
  SELECTED,
  DELETE_OP,
  SEMA_REACTION_REGEX,
  SEMA_TAGS_REGEX,
  SEMABAR_CLASS,
  ADD_OP,
  CREATE_SMART_COMMENT_URL,
} from '../constants';

import { suggest } from './commentSuggestions';
import {
  closeAllDropdowns,
  updateSelectedEmoji,
  addSuggestedTags,
  resetSemaStates,
} from './redux/action';
import store from './redux/store';

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

export const getSemaGithubText = (selectedEmojiString, selectedTagsString) => {
  // If no reactions or tags selected, return blank string
  if (selectedEmojiString.length === 0 && selectedTagsString.length === 0) {
    return '';
  }

  let semaString = '---\n';
  if (selectedEmojiString) {
    semaString += `**Sema Reaction:** ${selectedEmojiString}`;
  }
  if (selectedEmojiString.length > 0 && selectedTagsString.length > 0) {
    semaString += ' | ';
  }
  if (selectedTagsString) {
    semaString += `**Sema Tags:**${selectedTagsString}`;
  }
  semaString += '\n';

  return semaString;
};

export const getInitialSemaValues = (textbox) => {
  const value = textbox.value;
  let initialReaction = EMOJIS[0];
  let initialTags = TAGS_INIT;
  let githubEmoji, selectedTags;
  if (value.includes('Sema Reaction')) {
    const reaction = '**Sema Reaction:** ';
    const reactionStart = value.indexOf(reaction) + reaction.length;
    const reactionEnd =
      value.indexOf('|') > 0
        ? value.indexOf('|') - 1
        : value.lastIndexOf(':') + 1;
    const reactionStr = value.substring(reactionStart, reactionEnd);
    githubEmoji = reactionStr.substring(1, reactionStr.lastIndexOf(':'));
  }
  if (value.includes('Sema Tags')) {
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

export function writeSemaToGithub(textarea) {
  if (textarea) {
    let smartComment = {};
    let inLineMetada = {};

    const type = textarea?.id && textarea.id.includes('new_comment_field') ? 'comment' : 'inline';

    const semaSearchId = $(textarea).siblings('div.sema-search')?.[0]?.id;

    const semabar = $(textarea).siblings('div.sema')?.[0];
    const semaChildren = $(semabar).children();

    const emojiContainer = semaChildren?.[0];
    const tagContainer = semaChildren?.[1];

    const selectedReaction = $(emojiContainer).children()?.[0]?.textContent;
    const selectedTags = Array.from($(tagContainer)
      .children('.sema-tag')
      .map((index, tagElement) => tagElement?.textContent));

    const selectedEmojiObj = EMOJIS.find((emoji) =>
      selectedReaction?.includes(emoji.title)
    );

    const selectedEmojiString =
      selectedEmojiObj?.title && selectedEmojiObj?.title !== 'No reaction'
        ? `${selectedEmojiObj?.github_emoji} ${selectedEmojiObj?.title}`
        : '';

    let selectedTagsString = selectedTags.join(', ');

    let semaString = getSemaGithubText(selectedEmojiString, selectedTagsString);

    let textboxValue = textarea.value;

    const { selectedSuggestedComments } = store.getState().semasearches[semaSearchId];

    // TODO: Momentary implementation, for Tags retrieved from MongoDB
    const tags = selectedTags.map((tag) => (TAGS_ON_DB.find(({label}) => label === tag)._id));

    if (type === 'inline') {
     inLineMetada = getGithubInlineMetadata(textarea.id);
    }

    const githubMetadata = store.getState().githubMetadata;

    smartComment = { 
      githubMetadata: { ...githubMetadata, ...inLineMetada },
      userId: USER._id,
      commentId: new Date().getTime(),
      comment: textboxValue, 
      type,
      suggestedComments: selectedSuggestedComments,
      reaction: selectedEmojiObj._id, 
      tags,
    };

    createSmartComment(smartComment);

    if (
      textboxValue.includes('Sema Reaction') ||
      textboxValue.includes('Sema Tags')
    ) {
      // this textbox already has sema text
      // this is an edit

      // Use individual REGEX's for reactions and tags
      // textboxValue = textboxValue.replace(SEMA_GITHUB_REGEX, '');
      textboxValue = textboxValue.replace('\n---\n', '');
      textboxValue = textboxValue.replace(SEMA_REACTION_REGEX, '');
      textboxValue = textboxValue.replace(' | ', '');
      textboxValue = textboxValue.replace(SEMA_TAGS_REGEX, '');

      // On edit, do not add extra line breaks
      textarea.value = `${textboxValue}${semaString}`;
    } else {
      // On initial submit, 2 line breaks break up the markdown correctly
      textarea.value = `${textboxValue}\n\n${semaString}`;
    }
    const semaIds = getSemaIds($(textarea).attr('id'));
    store.dispatch(resetSemaStates(semaIds));
  }
}

export function onDocumentClicked(event, store) {
  onCloseAllModalsClicked(event, store);
  onGithubSubmitClicked(event);
}

function onGithubSubmitClicked(event) {
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

    writeSemaToGithub(textarea);
  }
}

function onCloseAllModalsClicked(event, store) {
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
  } else if (op === ADD_OP) {
    updatedTags = tags.map((tagObj) => {
      const modifiedObj = { ...tagObj };
      if (tag === tagObj[POSITIVE]) {
        modifiedObj[SELECTED] = POSITIVE;
      } else if (tag === tagObj[NEGATIVE]) {
        modifiedObj[SELECTED] = NEGATIVE;
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
  if (isValid) {
    const semabarContainer = $(activeElement).siblings(
      `div.${SEMABAR_CLASS}`
    )[0];

    const semabarId = $(semabarContainer).attr('id');

    const payload = suggest(activeElement.value);

    const state = store.getState();

    const { suggestedReaction, suggestedTags } = payload;
    if (suggestedReaction) {
      const isReactionDirty = state.semabars[semabarId].isReactionDirty;
      // isReactionDirty is true when reaction is manually selected from UI
      if (!isReactionDirty) {
        store.dispatch(
          updateSelectedEmoji({
            id: semabarId,
            selectedReaction: suggestedReaction,
            isReactionDirty: false,
          })
        );
      }
    }
    if (Array.isArray(suggestedTags) && suggestedTags.length) {
      store.dispatch(
        addSuggestedTags({
          id: semabarId,
          suggestedTags,
        })
      );
    }
  }
}

export function getSemaIds(idSuffix) {
  return {
    semabarContainerId: `semabar_${idSuffix}`,
    semaSearchContainerId: `semasearch_${idSuffix}`,
  };
}

export const getGithubMetadata = (document, textarea) => {
  const url = document.querySelector('meta[property="og:url"]')?.content;
  const decoupleUrl = url.split('/');
  const [,,,, repo,, pull_number] = decoupleUrl;
  const head = document.querySelector('span[class*="head-ref"] a')?.textContent;
  const base = document.querySelector('span[class*="base-ref"] a')?.textContent;
  const id = document.querySelector('meta[name="octolytics-dimension-user_id"]')?.content;
  const login = document.querySelector('meta[name="octolytics-actor-login"]')?.content;
  const requester = document.querySelector('a[class*="author"]')?.textContent;

  const githubMetada = {
    url,
    repo,
    pull_number,
    head,
    base,
    user: { id, login },
    requester,
  };

  return githubMetada;
};

export const getGithubInlineMetadata= (id) => {
  const [fileDivId] = id.split('new_inline_comment_diff_').pop().split('_');
  const filename = document.querySelector(`div[id=${fileDivId}] div[class^="file-header"] a`)?.title;
  const [,file_extension] = filename.split('.');
  const line_numbers = [ ...new Set(Array.from(document.querySelectorAll(`div[id=${fileDivId}] table tbody tr td`)).filter(e => e.getAttribute('data-line-number')).map(e => e.getAttribute('data-line-number')))];

  const inlineMetada = { filename, file_extension, line_numbers };

  return inlineMetada;
};

const createSmartComment = (smartComment) => {
  fetch(CREATE_SMART_COMMENT_URL, {
    headers: { 'Content-Type': 'application/json' },
    method:'POST',
    body: JSON.stringify(smartComment)
  })
};
