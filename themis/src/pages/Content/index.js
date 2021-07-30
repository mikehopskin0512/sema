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
} from './modules/content-util';

import {
  SEMA_ICON_ANCHOR_LIGHT,
  SEMABAR_CLASS,
  SEMA_SEARCH_CLASS,
  ON_INPUT_DEBOUCE_INTERVAL_MS,
  CALCULATION_ANIMATION_DURATION_MS,
  WHOAMI,
  SEMA_ICON_ANCHOR_DARK,
  SEMA_ICON_ANCHOR_DARK_DIMMED,
  LIGHT,
  DARK,
  DARK_DIMMED,
  EMOJIS, EMOJIS_ID
} from "./constants";

import Semabar from './Semabar.jsx';
import Searchbar from './Searchbar.jsx';
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

(() => {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    store.dispatch(updateSemaUser({ ...request }));
  });
  
  const checkLoggedIn = async () => {
    chrome.runtime.sendMessage({ [WHOAMI]: WHOAMI }, function (response) {
      store.dispatch(updateSemaUser({ ...response }));
    });
  };
  
  checkLoggedIn();
  let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(stateCheck);
      store.dispatch(addGithubMetada(getGithubMetadata(document)));
    }
  }, 100);
  let initialCheck = false;
  const updateMetadata = setInterval(() => {
    if (initialCheck) {
      clearInterval(updateMetadata);
    }
    store.dispatch(addGithubMetada(getGithubMetadata(document)));
    initialCheck = true;
  }, 5000);
  
  /**
   * Listening to click event for:
   * 1. if github button is pressed then put sema comments in the textarea
   * 2. things like closing modals when clicked outside of the element
   */
  document.addEventListener(
    'click',
    (event) => {
      onDocumentClicked(event, store);
    },
    // adding listener in the "capturing" phase
    true
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
        const activeElement = document.activeElement;
        if ($(activeElement).is('textarea')) {
          writeSemaToGithub(activeElement);
        }
      }
    },
    true
  );
  
  /**
   * "focus" event is when we put SEMA elements in the DOM
   * if the event.target is a valid DOM node for SEMA
   * then appropriate "div" roots are created and React elements are placed in the roots.
   */
  document.addEventListener(
    'focus',
    (event) => {
      const activeElement = event.target;
      if (isValidSemaTextBox(activeElement)) {
        checkLoggedIn();
        const semaElements = $(activeElement).siblings('div.sema');
        let extensionTheme = LIGHT;
        let themeClass = '';
        let SEMA_ICON = SEMA_ICON_ANCHOR_LIGHT;
        const colorMode = document.documentElement.getAttribute(
          'data-color-mode'
        );
  
        if (document.querySelector('.SelectMenu--hasFilter .SelectMenu-modal')) {
          document.querySelector(
            '.SelectMenu--hasFilter .SelectMenu-modal'
          ).style.maxHeight = '580px';
        }
  
        let colorTheme = document.documentElement.getAttribute(
          'data-light-theme'
        );
        if (colorMode === DARK) {
          extensionTheme = DARK;
          colorTheme = document.documentElement.getAttribute('data-dark-theme');
          if (colorTheme === DARK_DIMMED) {
            extensionTheme = DARK_DIMMED;
          }
        } else if (colorMode === 'auto') {
          const html = document.querySelector('[data-color-mode]');
          const githubTheme = getComputedStyle(html);
          const githubBgColor = githubTheme.backgroundColor;
          if (githubBgColor === 'rgb(13, 17, 23)') {
            extensionTheme = DARK;
          } else if (githubBgColor === 'rgb(34, 39, 46)') {
            extensionTheme = DARK_DIMMED;
          }
        }
        switch (extensionTheme) {
          case DARK:
            themeClass = 'theme--dark';
            SEMA_ICON = SEMA_ICON_ANCHOR_DARK;
            break;
          case DARK_DIMMED:
            themeClass = 'theme--dark-dimmed';
            SEMA_ICON = SEMA_ICON_ANCHOR_DARK_DIMMED;
            break;
          default:
            themeClass = '';
            SEMA_ICON = SEMA_ICON_ANCHOR_LIGHT;
            break;
        }
  
        const githubTextareaId = $(activeElement).attr('id');
        const { semabarContainerId, semaSearchContainerId } = getSemaIds(
          githubTextareaId
        );
        if (!semaElements[0]) {
          $(activeElement).on(
            'input',
            debounce((event) => {
              store.dispatch(
                updateTextareaState({
                  isTyping: true,
                })
              );
              setTimeout(() => {
                store.dispatch(
                  updateTextareaState({
                    isTyping: false,
                  })
                );
              }, CALCULATION_ANIMATION_DURATION_MS);
  
              onSuggestion(event, store);
            }, ON_INPUT_DEBOUCE_INTERVAL_MS)
          );
          /** ADD ROOTS FOR REACT COMPONENTS */
          // search bar container
          $(activeElement).before(
            `<div id=${semaSearchContainerId} class='${SEMA_SEARCH_CLASS} sema-mt-2 sema-mb-2 ${themeClass}'></div>`
          );
          // semabar container
          $(activeElement).after(
            `<div id=${semabarContainerId} class='${SEMABAR_CLASS} ${themeClass}'></div>`
          );
  
          /** ADD RESPECTIVE STATES FOR REACT COMPONENTS */
          store.dispatch(
            addSemaComponents({
              seedId: githubTextareaId,
              activeElement,
            })
          );
  
          /** RENDER REACT COMPONENTS ON RESPECTIVE ROOTS */
          // Render searchbar
          ReactDOM.render(
            <Provider store={store}>
              <Searchbar id={semaSearchContainerId} commentBox={activeElement} />
            </Provider>,
            $(activeElement).siblings(`div.${SEMA_SEARCH_CLASS}`)[0]
          );
          // Render Semabar
          ReactDOM.render(
            <Provider store={store}>
              <Semabar id={semabarContainerId} style={{ position: 'relative' }} />
            </Provider>,
            $(activeElement).siblings(`div.${SEMABAR_CLASS}`)[0]
          );
  
          /** RENDER MIRROR*/
          // TODO: try to make it into React component for consistency and not to have to pass store
          new Mirror(activeElement, getHighlights, {
            onMouseoverHighlight: (payload) => {
              // close existing
              store.dispatch(toggleGlobalSearchModal());
              store.dispatch(
                toggleGlobalSearchModal({
                  ...payload,
                  isLoading: true,
                  openFor: $(activeElement).attr('id'),
                })
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
  
        //add default reaction for approval comment
        const isReviewChangesContainer = semabarContainerId === 'semabar_pull_request_review_body';
        if (isReviewChangesContainer) {
          const barState = store.getState().semabars[semabarContainerId];
          const isReactionDirty = barState.isReactionDirty;
          const selectedReactionId = barState.selectedReaction._id
          if (!isReactionDirty) {
            handleReviewChangesClick(semabarContainerId, activeElement, selectedReactionId)
          }
        }
      }
    },
    true
  );
  
  function handleReviewChangesClick(semabarContainerId, activeElement, selectedReactionId) {
    const looksGoodEmoji = EMOJIS.find((e) => e._id === EMOJIS_ID.GOOD);
    const noReactionEmoji = EMOJIS.find((e) => e._id === EMOJIS_ID.NO_REACTION);
    const form = $(activeElement).parents('form')?.[0];
    const isApprovedOption = $(form).find('input[value="approve"]')?.[0]
      .checked;
    const isEmptyComment = !activeElement.value
    let reaction = isApprovedOption && (isEmptyComment || selectedReactionId === EMOJIS_ID.GOOD) ? looksGoodEmoji : noReactionEmoji;
    store.dispatch(
      updateSelectedEmoji({
        id: semabarContainerId,
        selectedReaction: reaction,
        isReactionDirty: false,
      })
    );
  }
  
  document.addEventListener(
    'focusin',
    (event) => {
      const githubCommentField =
        'textarea#new_comment_field.form-control.input-contrast.comment-form-textarea.js-comment-field.js-paste-markdown.js-task-list-field.js-quick-submit.js-size-to-fit.js-session-resumable.js-saved-reply-shortcut-comment-field';
      if (event.target === document.querySelector(githubCommentField)) {
        $('div.sema').addClass('sema-is-form-bordered');
      }
    },
    true
  );
  
  document.addEventListener(
    'focusout',
    (event) => {
      $('div.sema').removeClass('sema-is-form-bordered');
    },
    true
  );

  const destructor = () => (document.removeEventListener(destructionEvent, destructor));
  
  const destructionEvent = 'destructmyextension_' + chrome.runtime.id;
  // Unload previous content script if needed
  document.dispatchEvent(new CustomEvent(destructionEvent));
  document.addEventListener(destructionEvent, destructor);
})();
