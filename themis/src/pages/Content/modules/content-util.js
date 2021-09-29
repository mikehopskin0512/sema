import $ from 'cash-dom';

import amplitude from 'amplitude-js';

import {
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
  SMART_COMMENT_URL,
  IS_DIRTY,
  DELIMITERS,
  AMPLITUDE_API_KEY,
  EVENTS,
  SEMA_TEXTAREA_IDENTIFIER,
  SUGGESTED_COMMENTS_URL,
} from '../constants';

import suggest from './commentSuggestions';
import {
  closeAllDropdowns,
  updateSelectedEmoji,
  addSuggestedTags,
  resetSemaStates,
  addSmartComment,
  addMutationObserver,
  removeMutationObserver,
  closeAllEmojiSelection,
} from './redux/action';
// TODO: good if we can break cyclic dependencies
// eslint-disable-next-line import/no-cycle
import store from './redux/store';

import phrases from './highlightPhrases';

// FIXME: no need for the function to accept 'document'
export const getGithubMetadata = (document) => {
  const url = document.querySelector('meta[property="og:url"]')?.content || '';
  const decoupleUrl = url.split('/');
  // eslint-disable-next-line camelcase
  const repo_id = document.querySelector('input[name="repository_id"]')?.value;
  // eslint-disable-next-line camelcase
  const [, , , , repo, , pull_number] = decoupleUrl;
  const head = document.querySelector('span[class*="head-ref"] a')?.textContent;
  const base = document.querySelector('span[class*="base-ref"] a')?.textContent;
  const id = document.querySelector('meta[name="octolytics-dimension-user_id"]')
    ?.content;
  const login = document.querySelector('meta[name="octolytics-actor-login"]')
    ?.content;
  const requester = document.querySelector('a[class*="author"]')?.textContent;
  const requesterAvatarUrl = document.querySelector(`img[alt*="@${requester}"]`)?.src;
  const title = document.querySelector('span[data-snek-id="issue-title"]')
    ?.innerText;
  // eslint-disable-next-line camelcase
  const clone_url = document.querySelector('#clone-help-git-url')?.value;

  const githubMetadata = {
    url,
    repo_id,
    repo,
    pull_number,
    head,
    base,
    user: { id, login },
    requester,
    title,
    clone_url,
    commentId: null,
    requesterAvatarUrl,
  };

  return githubMetadata;
};

export const fireAmplitudeEvent = (event, opts) => {
  const githubMetadata = getGithubMetadata(document);

  amplitude.getInstance().logEvent(event, {
    ...opts,
    ...githubMetadata,
    url: window.location.href,
  });
};

export const initAmplitude = () => {
  const githubMetadata = getGithubMetadata(document);

  const { user: { login } } = githubMetadata;

  amplitude.getInstance().init(AMPLITUDE_API_KEY, login);

  fireAmplitudeEvent(EVENTS.PAGE_VISIT);
  let lastLocation = window.location.href;
  // no good way to detect all types of URL changes
  setInterval(() => {
    const currentLocation = window.location.href;
    if (lastLocation !== currentLocation) {
      lastLocation = currentLocation;
      fireAmplitudeEvent(EVENTS.PAGE_VISIT);
    }
  }, 200);
};

export const isTextBox = (element) => {
  const tagName = element.tagName.toLowerCase();
  if (tagName === 'textarea') return true;
  return false;
};

export const isValidSemaTextBox = (element) => {
  const parent = $(element).parents('file-attachment');
  const fileHeaderSibling = parent.length && $(parent).siblings('.comment-form-head');
  return isTextBox(element) && fileHeaderSibling.length;
};

export const getSemaGithubText = (selectedEmojiString, selectedTagsString) => {
  // eslint-disable-next-line no-param-reassign
  selectedEmojiString = selectedEmojiString
    .replaceAll('<b>', '')
    .replaceAll('</b>', '');

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
    semaString += `**Sema Tags:** ${selectedTagsString}`;
  }
  semaString += '\n';

  return semaString;
};

export const getInitialSemaValues = (textbox) => {
  const { value } = textbox;
  let initialReaction = EMOJIS[0];
  let initialTags = TAGS_INIT;
  let githubEmoji; let
    selectedTags;
  if (value.includes('Sema Reaction')) {
    const reaction = '**Sema Reaction:** ';
    const reactionStart = value.indexOf(reaction) + reaction.length;
    const reactionEnd = value.indexOf('|') > 0
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
      (emoji) => emoji.github_emoji === `:${githubEmoji}:`,
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
        (tag) => tag === positiveTag || tag === negativeTag,
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

const updateSmartComment = async (comment) => {
  const { _id: id } = comment;
  const res = await fetch(`${SMART_COMMENT_URL}/${id}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
    body: JSON.stringify(comment),
  });
  const response = await res.text();
  const { smartComment } = JSON.parse(response);
  return smartComment;
};

export const saveSmartComment = async (comment) => {
  await fetch(`${SUGGESTED_COMMENTS_URL}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(comment),
  });
};

export const onConversationMutationObserver = ([mutation]) => {
  if (mutation.addedNodes.length) {
    const nodeIndex = [...mutation.addedNodes].findIndex(
      (node) => 'classList' in node && node.classList.contains('js-timeline-item'),
    );

    const singleNode = [...mutation.addedNodes].findIndex(
      (node) => 'classList' in node && node.classList.contains('review-comment'),
    );

    const { smartComment } = store.getState();

    if (nodeIndex !== -1) {
      const newCommentDiv = mutation.addedNodes[nodeIndex];
      const { id } = newCommentDiv.querySelector(
        'div.timeline-comment-group',
      );
      smartComment.githubMetadata.commentId = id;
    } else if (singleNode !== -1) {
      const { id } = mutation.addedNodes[singleNode];
      smartComment.githubMetadata.commentId = id;
    } else {
      return;
    }
    updateSmartComment(smartComment);
    store.dispatch(removeMutationObserver());
  }
};

export const onFilesChangedMutationObserver = ([mutation]) => {
  if (mutation.addedNodes.length) {
    const threadNode = [...mutation.addedNodes].findIndex(
      (node) => 'classList' in node
        && node.classList.contains('js-resolvable-timeline-thread-container'),
    );
    const singleNode = [...mutation.addedNodes].findIndex(
      (node) => 'classList' in node && node.classList.contains('review-comment'),
    );

    const { smartComment } = store.getState();

    if (threadNode !== -1) {
      const newCommentDiv = mutation.addedNodes[threadNode];
      const { id } = newCommentDiv.querySelector('div.review-comment');
      smartComment.githubMetadata.commentId = id;
    } else if (singleNode !== -1) {
      const { id } = mutation.addedNodes[singleNode];
      smartComment.githubMetadata.commentId = id;
    } else {
      return;
    }
    updateSmartComment(smartComment);
    store.dispatch(removeMutationObserver());
  }
};

export const getGithubInlineMetadata = (id) => {
  const [fileDivId] = id.split('new_inline_comment_diff_').pop().split('_');
  const filename = document.querySelector(
    `div[id=${fileDivId}] div[class^="file-header"] a`,
  )?.title;

  let fileExtension = '';
  if (filename) {
    // eslint-disable-next-line prefer-destructuring
    fileExtension = filename.split('.').reverse[0];
  }

  const allElements = Array.from(
    document.querySelectorAll(`div[id=${fileDivId}] table tbody tr td`),
  );

  const allLineNos = allElements.reduce((acc, curr) => {
    const value = curr.getAttribute('data-line-number');
    if (value) {
      acc[value] = true;
    }
    return acc;
  }, {});

  const lineNumbers = Object.keys(allLineNos);

  const inlineMetada = { filename, file_extension: fileExtension, line_numbers: lineNumbers };

  return inlineMetada;
};

const createSmartComment = async (comment) => {
  const res = await fetch(SMART_COMMENT_URL, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(comment),
  });
  const response = await res.text();
  const { smartComment } = JSON.parse(response);
  return smartComment;
};

export const getSemaIdentifier = (activeElement) => {
  if (!(activeElement instanceof HTMLElement)) {
    throw new Error('Should be an HTMLElement');
  }

  return $(activeElement).attr(SEMA_TEXTAREA_IDENTIFIER);
};

export const getSemaIdsFromIdentifier = (semaIdentifier) => {
  if (typeof semaIdentifier !== 'string') {
    throw new Error('Should be sema identifier attribute');
  }
  return {
    semabarContainerId: `semabar_${semaIdentifier}`,
    semaSearchContainerId: `semasearch_${semaIdentifier}`,
    semaMirror: `semamirror_${semaIdentifier}`,
  };
};

export function getSemaIds(activeElement) {
  if (!(activeElement instanceof HTMLElement)) {
    throw new Error('Should be an HTMLElement');
  }

  const semaIdentifier = getSemaIdentifier(activeElement);
  return getSemaIdsFromIdentifier(semaIdentifier);
}

const isReply = (textarea) => {
  const isReplyComment = ['js-resolvable-thread-contents', 'review-thread-reply'].some((replyClass) => (($(textarea).parents(`.${replyClass}`).length > 0)));
  return isReplyComment;
};

export async function writeSemaToGithub(activeElement) {
  if (activeElement) {
    let comment = {};
    let inLineMetada = {};

    const isPullRequestReview = activeElement?.id && activeElement.id.includes('pending_pull_request_review_');
    const onFilesTab = document.URL.split('/').pop().includes('files');

    const location = onFilesTab ? 'files changed' : 'conversation';

    if (location === 'conversation') {
      store.dispatch(addMutationObserver({
        selector: 'div.pull-discussion-timeline .js-discussion',
        config: { childList: true, subtree: true },
        onMutationEvent: onConversationMutationObserver,
      }));
    } else {
      store.dispatch(addMutationObserver({
        selector: 'div#files',
        config: { childList: true, subtree: true },
        onMutationEvent: onFilesChangedMutationObserver,
      }));
      inLineMetada = getGithubInlineMetadata(activeElement.id);
    }

    const state = store.getState();

    const semaSearchId = $(activeElement).siblings('div.sema-search')?.[0]?.id;

    const semabar = $(activeElement).siblings('div.sema')?.[0];

    const selectedEmojiObj = state.semabars[semabar.id].selectedReaction;

    const selectedTags = state.semabars[semabar.id].selectedTags.reduce(
      (acc, tagObj) => {
        const { selected } = tagObj;
        if (selected) {
          acc.push(tagObj[selected]);
        }
        return acc;
      },
      [],
    );

    const selectedEmojiString = selectedEmojiObj?.title && selectedEmojiObj?.title !== 'No reaction'
      ? `${selectedEmojiObj?.github_emoji} ${selectedEmojiObj?.title}`
      : '';

    const selectedTagsString = selectedTags.join(', ');

    const semaString = getSemaGithubText(selectedEmojiString, selectedTagsString);

    let textboxValue = activeElement.value;

    const { selectedSuggestedComments } = store.getState().semasearches[
      semaSearchId
    ];

    // TODO: Momentary implementation, for Tags retrieved from MongoDB
    const tags = selectedTags.map(
      // eslint-disable-next-line no-underscore-dangle
      (tag) => TAGS_ON_DB.find(({ label }) => label === tag)._id,
    );

    if (
      textboxValue.includes('Sema Reaction')
      || textboxValue.includes('Sema Tags')
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
      // eslint-disable-next-line no-param-reassign
      activeElement.value = `${textboxValue}${semaString}`;
    } else {
      // On initial submit, 2 line breaks break up the markdown correctly
      // eslint-disable-next-line no-param-reassign
      activeElement.value = `${textboxValue}\n\n${semaString}`;
    }

    const { githubMetadata, lastUserSmartComment } = store.getState();
    const { _id: userId } = store.getState().user;

    let fileExtention = $(activeElement)?.parents('.file')?.attr('data-file-type');
    if (!fileExtention) {
      const url = $(activeElement)
        .parents('.file')
        .children('.file-header')
        .children('.Link--primary')
        .attr('title');
      fileExtention = url
        ? `.${url?.split(/[#?]/)[0]?.split('.')?.pop()?.trim()}`
        : null;
    }

    comment = {
      githubMetadata: { ...githubMetadata, ...inLineMetada, file_extension: fileExtention },
      userId,
      comment: textboxValue,
      location,
      suggestedComments: selectedSuggestedComments,
      // eslint-disable-next-line no-underscore-dangle
      reaction: selectedEmojiObj._id,
      tags,
    };

    if (isPullRequestReview) {
      store.dispatch(removeMutationObserver());
      const pullRequestReviewId = activeElement?.id.split('_').pop();
      const commentDiv = document.querySelector(
        `div[data-gid="${pullRequestReviewId}"] div[id^="pullrequestreview-"]`,
      );
      comment.githubMetadata.commentId = commentDiv?.id;
      createSmartComment(comment);
    }

    createSmartComment(comment).then((smartComment) => {
      store.dispatch(addSmartComment(smartComment));
    });

    const opts = {
      isSemaBarUsed: false,
      isReply: isReply(activeElement),
      isSuggestedCommentUsed: activeElement.value.includes(lastUserSmartComment),
    };
    if (typeof semaString === 'string' && semaString.length) {
      opts.isSemaBarUsed = true;
    }

    fireAmplitudeEvent(EVENTS.SUBMIT, opts);
    const semaIds = getSemaIds(activeElement);
    store.dispatch(resetSemaStates(semaIds));
  }
}

function closeSemaOpenElements(event) {
  const { target } = event;
  const dropdownParents = $(target).parents('.sema-dropdown');
  if (!dropdownParents.length) {
    store.dispatch(closeAllDropdowns());
  } else {
    // if any other dropdown is open other than this one, close it
    const allDropdowns = $(document).find('.sema-dropdown');
    const openDropdown = $(allDropdowns).filter('.sema-is-active');
    if (openDropdown[0] !== dropdownParents[0]) {
      store.dispatch(closeAllDropdowns());
    }
  }

  const selectingEmojiParents = $(target).parents(
    '.reaction-selection-wrapper',
  );
  if (!selectingEmojiParents.length) {
    store.dispatch(closeAllEmojiSelection());
  }
}

function onGithubSubmitClicked(event) {
  const { target } = event;
  const parentButton = $(target).parents('button')?.[0];
  const isButton = $(target).is('button') || $(parentButton).is('button');
  const isSubmitButton = isButton
    && ($(target).attr('type') === 'submit'
      || $(parentButton).attr('type') === 'submit');

  if (isSubmitButton) {
    const formParent = $(target).parents('form')?.[0];
    const textarea = $(formParent).find(
      'file-attachment div text-expander textarea',
    )?.[0];

    writeSemaToGithub(textarea);
  }
}

function onReviewChangesClicked(event) {
  const isReviewOption = event.target.name === 'pull_request_review[event]';
  if (isReviewOption) {
    const formParent = $(event.target).parents('form')?.[0];
    const textarea = $(formParent).find('textarea')?.[0];
    textarea.focus();
  }
}

export function onDocumentClicked(event) {
  closeSemaOpenElements(event);
  onGithubSubmitClicked(event);
  onReviewChangesClicked(event);
}

export const toggleTagSelection = (
  operation,
  tags,
  isUserOperation = false,
) => {
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
        modifiedObj[IS_DIRTY] = isUserOperation;
      }
      return modifiedObj;
    });
  } else if (op === ADD_OP) {
    updatedTags = tags.map((tagObj) => {
      const modifiedObj = { ...tagObj };
      if (tag === tagObj[POSITIVE]) {
        modifiedObj[SELECTED] = POSITIVE;
        modifiedObj[IS_DIRTY] = isUserOperation;
      } else if (tag === tagObj[NEGATIVE]) {
        modifiedObj[SELECTED] = NEGATIVE;
        modifiedObj[IS_DIRTY] = isUserOperation;
      }
      return modifiedObj;
    });
  } else {
    updatedTags = tags.map((tagObj) => {
      const modifiedObj = { ...tagObj };

      // If tag is already selected, set selection to null on toggle
      if (
        isSelected
        && (tag === tagObj[POSITIVE] || tag === tagObj[NEGATIVE])
      ) {
        modifiedObj[SELECTED] = null;
        modifiedObj[IS_DIRTY] = isUserOperation;
        return modifiedObj;
      }

      // Otherwise, set positive or negative tag for selection
      if (tag === tagObj[POSITIVE]) {
        modifiedObj[SELECTED] = POSITIVE;
        modifiedObj[IS_DIRTY] = isUserOperation;
      } else if (tag === tagObj[NEGATIVE]) {
        modifiedObj[SELECTED] = NEGATIVE;
        modifiedObj[IS_DIRTY] = isUserOperation;
      }
      return modifiedObj;
    });
  }
  return updatedTags;
};

export function onSuggestion() {
  const { activeElement } = document;
  const isValid = isValidSemaTextBox(activeElement);
  if (isValid) {
    const semabarContainer = $(activeElement).siblings(
      `div.${SEMABAR_CLASS}`,
    )[0];

    const semabarId = $(semabarContainer).attr('id');

    const payload = suggest(activeElement.value);

    const state = store.getState();

    const { suggestedReaction, suggestedTags } = payload;
    const { isReactionDirty, isTagModalDirty } = state.semabars[semabarId];
    if (suggestedReaction) {
      // isReactionDirty is true when reaction is manually selected from UI
      if (!isReactionDirty) {
        store.dispatch(
          updateSelectedEmoji({
            id: semabarId,
            selectedReaction: suggestedReaction,
            isReactionDirty: false,
          }),
        );
      }
    }
    // allow to change state even when empty to remove existing tags if no suggestion
    if (!isTagModalDirty && suggestedTags) {
      store.dispatch(
        addSuggestedTags({
          id: semabarId,
          suggestedTags,
        }),
      );
    }
  }
}

export const getHighlights = (text) => {
  const alerts = [];
  let id = 0;

  const isOverlap = (existingTokenData, newTokenData) => {
    const { startOffset, endOffset } = existingTokenData;
    const { start, end } = newTokenData;
    let isOverlapped = false;
    if (
      (start >= startOffset && start <= endOffset)
      || (end >= startOffset && end <= endOffset)
    ) {
      isOverlapped = true;
    }
    return isOverlapped;
  };

  const insertIfValid = ({ start, end, phrase }) => {
    let isOverlapping = false;
    let overlappingAlert;
    let overlappingIndex;
    alerts.forEach((existingAlert, index) => {
      const overlapping = isOverlap(existingAlert, { start, end, phrase });
      if (overlapping) {
        isOverlapping = true;
        overlappingAlert = existingAlert;
        overlappingIndex = index;
      }
    });

    if (isOverlapping) {
      if (phrase.length >= overlappingAlert.token.length) {
        // replace
        alerts[overlappingIndex] = {
          id: overlappingAlert.id,
          startOffset: start,
          endOffset: end,
          token: phrase,
        };
      }
    } else {
      id += 1;
      alerts.push({
        id: id.toString(),
        startOffset: start,
        endOffset: end,
        token: phrase,
      });
    }
  };

  const getIndicesOf = (searchStr, str, caseSensitive) => {
    const searchStrLen = searchStr.length;
    if (searchStrLen === 0) {
      return [];
    }
    let startIndex = 0;
    let index;
    const indices = [];
    if (!caseSensitive) {
      // eslint-disable-next-line no-param-reassign
      str = str.toLowerCase();
      // eslint-disable-next-line no-param-reassign
      searchStr = searchStr.toLowerCase();
    }
    // eslint-disable-next-line no-cond-assign
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
      startIndex = index + searchStrLen;

      const nextChar = str[startIndex];
      const prevChar = str[index - 1];

      if (
        (nextChar === undefined || DELIMITERS.some((delimitter) => delimitter === nextChar))
        && (prevChar === undefined || DELIMITERS.some((delimitter) => delimitter === prevChar))) {
        indices.push(index);
      }
    }
    return indices;
  };

  phrases.forEach((phrase) => {
    const startIndices = getIndicesOf(phrase, text, false);
    startIndices.forEach((matchIndexStart) => {
      if (matchIndexStart !== -1) {
        const matchIndexEnd = matchIndexStart + phrase.length - 1;
        insertIfValid({ start: matchIndexStart, end: matchIndexEnd, phrase });
      }
    });
  });
  return alerts;
};

export const checkSubmitButton = (semabarId, data) => {
  const semabarData = data || store.getState().semabars[semabarId];
  const { selectedReaction, selectedTags } = semabarData;

  const activeElement = $(`#${semabarId}`).prev().get(0);
  const textareaValue = activeElement.value.trim();

  const parents = $(`#${semabarId}`).parentsUntil('form');
  const lastParent = parents[parents.length - 1];
  const formButtons = $(lastParent).next();
  const primaryButton = $(formButtons).contents().find('button.btn.btn-primary');
  // eslint-disable-next-line max-len
  const shouldShowButton = selectedReaction.title !== EMOJIS[0].title || (selectedTags.find((tag) => tag.selected));
  if (!textareaValue) {
    if (shouldShowButton) {
      $(primaryButton).removeAttr('disabled');
    } else {
      $(primaryButton).attr('disabled', true);
    }
  } else {
    $(primaryButton).removeAttr('disabled');
  }
};

export const isPRPage = () => document.URL.includes('/pull/');

export const setTextareaSemaIdentifier = (activeElement) => {
  const { id } = activeElement;
  const semaIdentifier = `sema-${id}-${Date.now()}`;
  $(activeElement).attr(SEMA_TEXTAREA_IDENTIFIER, semaIdentifier);
};
