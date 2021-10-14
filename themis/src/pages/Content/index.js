/**
 * - TODO: remove "Bulma Base" from bulma.css
 * - TODO: remove listeners at appropriate time if needed
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import $ from 'cash-dom';
import { debounce } from 'lodash';
import SemaExtensionRegistry from './modules/SemaExtensionRegistry';
import {
  isValidSemaTextBox,
  onDocumentClicked,
  onSuggestion,
  getSemaIds,
  writeSemaToGithub,
  getGithubMetadata,
  getHighlights,
  isPRPage,
  initAmplitude,
  setTextareaSemaIdentifier,
  checkSubmitButton,
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
  SEMA_TEXTAREA_IDENTIFIER,
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

window.semaExtensionRegistry = new SemaExtensionRegistry();

chrome.runtime.onMessage.addListener((request) => {
  store.dispatch(updateSemaUser({ ...request }));
});

const checkLoggedIn = async (cb) => {
  try {
    chrome.runtime.sendMessage({ [WHOAMI]: WHOAMI }, (response) => {
      store.dispatch(updateSemaUser({ ...response }));
      cb(response);
    });
  } catch (error) {
    // console.log('Sema Code Assistant extension is disabled');
  }
};

const onLoginChecked = () => {
  $(() => {
    initAmplitude();

    const reminderRoot = document.getElementById(SEMA_REMINDER_ROOT_ID);
    if (!reminderRoot && isPRPage()) {
      const node = document.createElement('div');
      node.id = SEMA_REMINDER_ROOT_ID;
      node.className = `${getActiveThemeClass()}`;
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
  window.semaExtensionRegistry.registerEventListener('click', (event) => {
    onDocumentClicked(event);
  }, true);

  /**
       * While on textbox pressing "CTRL + ENTER" or "CMD + ENTER" or "WINDOW + ENTER"
       * also triggers text submission
       */
  window.semaExtensionRegistry.registerEventListener('keydown',
    (event) => {
      const { code, ctrlKey, metaKey } = event;
      if ((ctrlKey || metaKey) && code === 'Enter') {
        const { activeElement } = document;
        if ($(activeElement).is('textarea')) {
          writeSemaToGithub(activeElement);
        }
      }
    },
    true);

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

  function onTextPaste(semabarContainerId) {
    return function setDefaultEmoji() {
      const state = store.getState();
      const { isReactionDirty } = state.semabars[semabarContainerId];
      if (isReactionDirty) {
        return;
      }
      const selectedReaction = EMOJIS.find(({ _id }) => _id === EMOJIS_ID.FIX);
      store.dispatch(
        updateSelectedEmoji({
          id: semabarContainerId,
          selectedReaction,
          isReactionDirty: true,
        }),
      );
    };
  }

  const getDebouncedInput = () => debounce(() => {
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
  }, ON_INPUT_DEBOUCE_INTERVAL_MS);

  /**
       * "focus" event is when we put SEMA elements in the DOM
       * if the event.target is a valid DOM node for SEMA
       * then appropriate "div" roots are created and React elements are placed in the roots.
       */
  window.semaExtensionRegistry.registerEventListener('focus', (event) => {
    const activeElement = event.target;
    if (isPRPage()) {
      if (isValidSemaTextBox(activeElement)) {
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

        if (!$(activeElement).attr(SEMA_TEXTAREA_IDENTIFIER)) {
          setTextareaSemaIdentifier(activeElement);
        }

        window.semaExtensionRegistry.registerGithubTextarea(activeElement);

        const { semabarContainerId, semaSearchContainerId } = getSemaIds(
          activeElement,
        );
        if (!semaElements[0]) {
          const debouncedOnInput = getDebouncedInput();

          window.semaExtensionRegistry.registerElementEventListener(activeElement, 'input', () => {
            /**
               * check for the button's behaviour
               * after github's own validation
               * has taken place for the textarea
              */
            setTimeout(() => {
              checkSubmitButton(semabarContainerId);
            }, 0);
            debouncedOnInput();
          });

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
              activeElement,
            }),
          );

          /** RENDER REACT COMPONENTS ON RESPECTIVE ROOTS */
          // Render searchbar
          const searchBarNode = document.getElementById(semaSearchContainerId);
          ReactDOM.render(
            // eslint-disable-next-line react/jsx-filename-extension
            <Provider store={store}>
              <Searchbar
                id={semaSearchContainerId}
                onTextPaste={onTextPaste(semabarContainerId)}
                commentBox={activeElement}
              />
            </Provider>,
            searchBarNode,
          );
          // Render Semabar
          const semaBarNode = document.getElementById(semabarContainerId);
          ReactDOM.render(
            <Provider store={store}>
              <Semabar
                id={semabarContainerId}
                style={{ position: 'relative' }}
              />
            </Provider>,
            semaBarNode,
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
            onTextPaste: onTextPaste(semabarContainerId),
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
    }
  },
  true);

  window.semaExtensionRegistry.registerEventListener('focusin', (event) => {
    const commentFieldClassName = 'comment-form-textarea';
    // const pullRequestReviewBodyId = 'pull_request_review_body';
    if (event.target.classList.contains(commentFieldClassName)) {
      $('div.sema').addClass('sema-is-form-bordered');
    }
    // if (event.target.id === pullRequestReviewBodyId) {
    //   $(`#${pullRequestReviewBodyId}`).addClass('sema-is-form-bordered');
    // }
  }, true);

  window.semaExtensionRegistry.registerEventListener('focusout', () => {
    $('div.sema').removeClass('sema-is-form-bordered');
  },
  true);
};

checkLoggedIn(onLoginChecked);

const destructionEvent = `destructmyextension_${chrome.runtime.id}`;
const destructor = () => document.removeEventListener(destructionEvent, destructor);

// Unload previous content script if needed
document.dispatchEvent(new CustomEvent(destructionEvent));
document.addEventListener(destructionEvent, destructor);
