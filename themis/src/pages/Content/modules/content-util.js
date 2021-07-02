import $ from 'cash-dom';

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
} from '../constants';

import { suggest } from './commentSuggestions';
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

export async function writeSemaToGithub(textarea) {
  if (textarea) {
    let comment = {};
    let inLineMetada = {};

    const isPullRequestReview = textarea?.id && textarea.id.includes('pending_pull_request_review_');
    const onFilesTab = document.URL.split('/').pop().includes('files');

    const location =
      onFilesTab 
      ? 'files changed'
      : 'conversation';

    if (location === 'conversation') {
      store.dispatch(addMutationObserver(setMutationObserverAtConversation()));
    } else {
      store.dispatch(addMutationObserver(setMutationObserverAtFilesChanged()));
      inLineMetada = getGithubInlineMetadata(textarea.id);
    }

    const state = store.getState();

    const semaSearchId = $(textarea).siblings('div.sema-search')?.[0]?.id;

    const semabar = $(textarea).siblings('div.sema')?.[0];

    const selectedEmojiObj = state.semabars[semabar.id].selectedReaction;

    const selectedTags = state.semabars[semabar.id].selectedTags.reduce(
      (acc, tagObj) => {
        const { selected } = tagObj;
        if (selected) {
          acc.push(tagObj[selected]);
        }
        return acc;
      },
      []
    );

    const selectedEmojiString =
      selectedEmojiObj?.title && selectedEmojiObj?.title !== 'No reaction'
        ? `${selectedEmojiObj?.github_emoji} ${selectedEmojiObj?.title}`
        : '';

    let selectedTagsString = selectedTags.join(', ');

    let semaString = getSemaGithubText(selectedEmojiString, selectedTagsString);

    let textboxValue = textarea.value;

    const { selectedSuggestedComments } = store.getState().semasearches[
      semaSearchId
    ];

    // TODO: Momentary implementation, for Tags retrieved from MongoDB
    const tags = selectedTags.map(
      (tag) => TAGS_ON_DB.find(({ label }) => label === tag)._id
    );

    const githubMetadata = store.getState().githubMetadata;
    const { _id: userId } = store.getState().user;

    comment = {
      githubMetadata: { ...githubMetadata, ...inLineMetada },
      userId,
      comment: textboxValue,
      location,
      suggestedComments: selectedSuggestedComments,
      reaction: selectedEmojiObj._id,
      tags,
    };

    if (isPullRequestReview) {
      store.dispatch(removeMutationObserver());
      const pullRequestReviewId = textarea?.id.split('_').pop();
      const commentDiv = document.querySelector(`div[data-gid="${pullRequestReviewId}"] div[id^="pullrequestreview-"]`);
      comment.githubMetadata.commentId = commentDiv?.id;
      createSmartComment(comment);
    } 

    const smartComment = await createSmartComment(comment);
    store.dispatch(addSmartComment(smartComment));

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
  closeSemaOpenElements(event, store);
  onGithubSubmitClicked(event, store);
}

function onGithubSubmitClicked(event, store) {
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

function closeSemaOpenElements(event, store) {
  const target = event.target;
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
    '.reaction-selection-wrapper'
  );
  if (!selectingEmojiParents.length) {
    store.dispatch(closeAllEmojiSelection());
  }
}

export const toggleTagSelection = (
  operation,
  tags,
  isUserOperation = false
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
        isSelected &&
        (tag === tagObj[POSITIVE] || tag === tagObj[NEGATIVE])
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
    // allow to change state even when empty to remove existing tags if no suggestion
    if (suggestedTags) {
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
  const url = document.querySelector('meta[property="og:url"]')?.content || '';
  const decoupleUrl = url.split('/');
  const repo_id = document.querySelector('input[name="repository_id"]')?.value;
  const [, , , , repo, , pull_number] = decoupleUrl;
  const head = document.querySelector('span[class*="head-ref"] a')?.textContent;
  const base = document.querySelector('span[class*="base-ref"] a')?.textContent;
  const id = document.querySelector('meta[name="octolytics-dimension-user_id"]')
    ?.content;
  const login = document.querySelector('meta[name="octolytics-actor-login"]')
    ?.content;
  const requester = document.querySelector('a[class*="author"]')?.textContent;

  const githubMetadata = {
    url,
    repo_id,
    repo,
    pull_number,
    head,
    base,
    user: { id, login },
    requester,
    commentId: null,
  };

  return githubMetadata;
};

export const getGithubInlineMetadata = (id) => {
  const [fileDivId] = id.split('new_inline_comment_diff_').pop().split('_');
  const filename = document.querySelector(
    `div[id=${fileDivId}] div[class^="file-header"] a`
  )?.title;
  const [, file_extension] = filename?.split('.') || [];
  const line_numbers = [
    ...new Set(
      Array.from(
        document.querySelectorAll(`div[id=${fileDivId}] table tbody tr td`)
      )
        .filter((e) => e.getAttribute('data-line-number'))
        .map((e) => e.getAttribute('data-line-number'))
    ),
  ];

  const inlineMetada = { filename, file_extension, line_numbers };

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

export const setMutationObserverAtConversation = () => {
  const observer = new MutationObserver(([mutation]) => {
    if (mutation.addedNodes.length) {
      const node = [...mutation.addedNodes].findIndex(
        (node) =>
          'classList' in node && node.classList.contains('js-timeline-item')
      );

      const singleNode = [...mutation.addedNodes].findIndex(
        (node) =>
          'classList' in node && node.classList.contains('review-comment')
      );

      let smartComment = store.getState().smartComment;

      if (node !== -1) {
        const newCommentDiv = mutation.addedNodes[node];
        const { id } = newCommentDiv.querySelector(
          'div.timeline-comment-group'
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
  });

  const commentsTimeline = document.querySelector(
    'div.pull-discussion-timeline .js-discussion'
  );
  observer.observe(commentsTimeline, { childList: true, subtree: true });

  return observer;
};

export const setMutationObserverAtFilesChanged = () => {
  const observer = new MutationObserver(([mutation]) => {
    if (mutation.addedNodes.length) {
      const threadNode = [...mutation.addedNodes].findIndex(
        (node) =>
          'classList' in node &&
          node.classList.contains('js-resolvable-timeline-thread-container')
      );
      const singleNode = [...mutation.addedNodes].findIndex(
        (node) =>
          'classList' in node && node.classList.contains('review-comment')
      );

      let smartComment = store.getState().smartComment;

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
  });

  const inLineFiles = document.querySelector('div#files');
  observer.observe(inLineFiles, { childList: true, subtree: true });

  return observer;
};
