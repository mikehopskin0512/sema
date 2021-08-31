/**
 * - TODO: remove "Bulma Base" from bulma.css
 * - TODO: remove listeners at appropriate time if needed
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import $ from 'cash-dom';
import { debounce } from 'lodash';

import {
  isValidSemaTextBox,
  onDocumentClicked,
  onSuggestion,
  getSemaIds,
  writeSemaToGithub,
  getGithubMetadata,
  getHighlights,
  isPRPage,
} from './modules/content-util';

import Reminder from './Reminder';

import {
  SEMA_ICON_ANCHOR_LIGHT,
  SEMABAR_CLASS,
  SEMA_SEARCH_CLASS,
  ON_INPUT_DEBOUCE_INTERVAL_MS,
  CALCULATION_ANIMATION_DURATION_MS,
  WHOAMI,
  EMOJIS,
  EMOJIS_ID,
  SEMA_REMINDER_ROOT_ID,
} from './constants';

import Semabar from './Semabar';
import Searchbar from './Searchbar';
import Mirror from './Mirror';

import store from './modules/redux/store';

import {
  addSemaComponents,
  toggleGlobalSearchModal,
  updateTextareaState,
  updateSemaUser,
  addGithubMetada,
  updateSelectedEmoji,
} from './modules/redux/action';
import { getActiveTheme, getActiveThemeClass, getSemaIconTheme } from '../../../utils/theme';

// const prPage = /[https://github.com/\w*/\w*/pull/\d+]/;

chrome.runtime.onMessage.addListener((request) => {
  store.dispatch(updateSemaUser({ ...request }));
});

const checkLoggedIn = async () => {
  try {
    chrome.runtime.sendMessage({ [WHOAMI]: WHOAMI }, (response) => {
      store.dispatch(updateSemaUser({ ...response }));
    });
  } catch (error) {
    console.log('Sema Code Assistant extension is disabled');
  }
};

$(() => {
  const reminderRoot = document.getElementById(SEMA_REMINDER_ROOT_ID);
  if (!reminderRoot && isPRPage()) {
    const node = document.createElement('div');
    node.id = SEMA_REMINDER_ROOT_ID;
    document.body.appendChild(node);
    ReactDOM.render(
      // eslint-disable-next-line react/jsx-filename-extension
      <Provider store={store}>
        <Reminder />
      </Provider>,
      node,
    );
  }
});

/**
   * Listening to click event for:
   * 1. if github button is pressed then put sema comments in the textarea
   * 2. things like closing modals when clicked outside of the element
   */
document.addEventListener(
  'click',
  (event) => {
    onDocumentClicked(event);
  },
  // adding listener in the "capturing" phase
  true,
);

/**
   * While on textbox pressing "CTRL + ENTER" or "CMD + ENTER" or "WINDOW + ENTER"
   * also triggers text submission
   */
document.addEventListener(
  'keydown',
  (event) => {
    const { code, ctrlKey, metaKey } = event;
    if ((ctrlKey || metaKey) && code === 'Enter') {
      const { activeElement } = document;
      if ($(activeElement).is('textarea')) {
        writeSemaToGithub(activeElement);
      }
    }
  },
  true,
);

function handleReviewChangesClick(
  semabarContainerId,
  activeElement,
  selectedReactionId,
) {
  // eslint-disable-next-line no-underscore-dangle
  const looksGoodEmoji = EMOJIS.find((e) => e._id === EMOJIS_ID.GOOD);
  // eslint-disable-next-line no-underscore-dangle
  const noReactionEmoji = EMOJIS.find((e) => e._id === EMOJIS_ID.NO_REACTION);
  const form = $(activeElement).parents('form')?.[0];
  const isApprovedOption = $(form).find('input[value="approve"]')?.[0]
    .checked;
  const isEmptyComment = !activeElement.value;
  const reaction = isApprovedOption
    && (isEmptyComment || selectedReactionId === EMOJIS_ID.GOOD)
    ? looksGoodEmoji
    : noReactionEmoji;
  store.dispatch(
    updateSelectedEmoji({
      id: semabarContainerId,
      selectedReaction: reaction,
      isReactionDirty: false,
    }),
  );
}

/**
   * "focus" event is when we put SEMA elements in the DOM
   * if the event.target is a valid DOM node for SEMA
   * then appropriate "div" roots are created and React elements are placed in the roots.
   */
document.addEventListener(
  'focus',
  (event) => {
    const activeElement = event.target;
    if (isPRPage()) {
      if (isValidSemaTextBox(activeElement)) {
        checkLoggedIn();
        store.dispatch(addGithubMetada(getGithubMetadata(document)));
        const semaElements = $(activeElement).siblings('div.sema');
        let SEMA_ICON = SEMA_ICON_ANCHOR_LIGHT;
        SEMA_ICON = getSemaIconTheme(getActiveTheme());

        if (
          document.querySelector('.SelectMenu--hasFilter .SelectMenu-modal')
        ) {
          document.querySelector(
            '.SelectMenu--hasFilter .SelectMenu-modal',
          ).style.maxHeight = '580px';
        }

        const githubTextareaId = $(activeElement).attr('id');
        const { semabarContainerId, semaSearchContainerId } = getSemaIds(
          githubTextareaId,
        );
        if (!semaElements[0]) {
          $(activeElement).on(
            'input',
            debounce(() => {
              store.dispatch(
                updateTextareaState({
                  isTyping: true,
                }),
              );
              setTimeout(() => {
                store.dispatch(
                  updateTextareaState({
                    isTyping: false,
                  }),
                );
              }, CALCULATION_ANIMATION_DURATION_MS);

              onSuggestion();
            }, ON_INPUT_DEBOUCE_INTERVAL_MS),
          );
          /** ADD ROOTS FOR REACT COMPONENTS */
          // search bar container
          $(activeElement).before(
            `<div id=${semaSearchContainerId} class='${SEMA_SEARCH_CLASS} sema-mt-2 sema-mb-2 ${getActiveThemeClass()}'></div>`,
          );
          // semabar container
          $(activeElement).after(
            `<div id=${semabarContainerId} class='${SEMABAR_CLASS} ${getActiveThemeClass()}'></div>`,
          );

          /** ADD RESPECTIVE STATES FOR REACT COMPONENTS */
          store.dispatch(
            addSemaComponents({
              seedId: githubTextareaId,
              activeElement,
            }),
          );

          /** RENDER REACT COMPONENTS ON RESPECTIVE ROOTS */
          // Render searchbar
          ReactDOM.render(
            // eslint-disable-next-line react/jsx-filename-extension
            <Provider store={store}>
              <Searchbar
                id={semaSearchContainerId}
                commentBox={activeElement}
              />
            </Provider>,
            $(activeElement).siblings(`div.${SEMA_SEARCH_CLASS}`)[0],
          );
          // Render Semabar
          ReactDOM.render(
            <Provider store={store}>
              <Semabar
                id={semabarContainerId}
                style={{ position: 'relative' }}
              />
            </Provider>,
            $(activeElement).siblings(`div.${SEMABAR_CLASS}`)[0],
          );

          /** RENDER MIRROR */
          // TODO: try to make it into React component for consistency and not to have to pass store
          // eslint-disable-next-line no-new
          new Mirror(activeElement, getHighlights, {
            onMouseoverHighlight: (payload) => {
              // close existing
              store.dispatch(toggleGlobalSearchModal());
              store.dispatch(
                toggleGlobalSearchModal({
                  ...payload,
                  isLoading: true,
                  openFor: $(activeElement).attr('id'),
                }),
              );
            },
            store,
            semaBarContainerId: semabarContainerId,
          });

          // Add Sema icon before Markdown icon
          const markdownIcon = $(activeElement)
            .parent()
            .siblings('label')
            .children('.tooltipped.tooltipped-nw');

          $(markdownIcon).after(SEMA_ICON);
        }

        // add default reaction for approval comment
        const isReviewChangesContainer = semabarContainerId === 'semabar_pull_request_review_body';
        if (isReviewChangesContainer) {
          const barState = store.getState().semabars[semabarContainerId];
          const { isReactionDirty } = barState;
          // eslint-disable-next-line no-underscore-dangle
          const selectedReactionId = barState.selectedReaction._id;
          if (!isReactionDirty) {
            handleReviewChangesClick(
              semabarContainerId,
              activeElement,
              selectedReactionId,
            );
          }
        }
      }
    } else if (!activeElement.classList.contains('sema-input')) {
      activeElement?.blur();
    }
  },
  true,
);

document.addEventListener(
  'focusin',
  (event) => {
    const commentFieldClassName = 'comment-form-textarea';
    const pullRequestReviewBodyId = 'pull_request_review_body';
    if (event.target.classList.contains(commentFieldClassName)) {
      $('div.sema').addClass('sema-is-form-bordered');
    }
    // if (event.target.id === pullRequestReviewBodyId) {
    //   $(`#${pullRequestReviewBodyId}`).addClass('sema-is-form-bordered');
    // }
  },
  true,
);

document.addEventListener(
  'focusout',
  () => {
    $('div.sema').removeClass('sema-is-form-bordered');
  },
  true,
);

const destructionEvent = `destructmyextension_${chrome.runtime.id}`;
const destructor = () => document.removeEventListener(destructionEvent, destructor);

// Unload previous content script if needed
document.dispatchEvent(new CustomEvent(destructionEvent));
document.addEventListener(destructionEvent, destructor);
