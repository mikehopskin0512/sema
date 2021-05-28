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
} from './modules/content-util';

import {
  SEMA_ICON_ANCHOR,
  SEMABAR_CLASS,
  SEMA_SEARCH_CLASS,
  ON_INPUT_DEBOUCE_INTERVAL_MS,
  CALCULATION_ANIMATION_DURATION_MS,
  WHOAMI,
} from './constants';

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
} from './modules/redux/action';

import highlightPhrases from './modules/highlightPhrases';

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

const highlightWords = highlightPhrases.reduce((acc, curr) => {
  acc[curr] = true;
  return acc;
}, {});

/**
 * Listening to click event for:
 * 1. if github button is pressed then put sems comments in the textarea
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
      const semaElements = $(activeElement).siblings('div.sema');
      if (!semaElements[0]) {
        const githubTextareaId = $(activeElement).attr('id');

        const { semabarContainerId, semaSearchContainerId } = getSemaIds(
          githubTextareaId
        );

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
          `<div id=${semaSearchContainerId} class='${SEMA_SEARCH_CLASS} sema-mt-2 sema-mb-2'></div>`
        );
        // semabar container
        $(activeElement).after(
          `<div id=${semabarContainerId} class='${SEMABAR_CLASS}'></div>`
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
            <Semabar id={semabarContainerId} />
          </Provider>,
          $(activeElement).siblings(`div.${SEMABAR_CLASS}`)[0]
        );

        /** RENDER MIRROR*/
        // TODO: try to make it into React component for consistency and not to have to pass store
        new Mirror(
          activeElement,
          (text) => {
            const tokens = text.split(/([\s,.!?]+)/g);
            const alerts = [];
            let curPos = 0;
            let id = 0;

            tokens.forEach((t, i) => {
              if (highlightWords[t]) {
                alerts.push({
                  id: (id++).toString(),
                  startOffset: curPos,
                  endOffset: curPos + t.length,
                  token: t,
                });
              }

              curPos += t.length;
            });

            return alerts;
          },
          {
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
          }
        );

        // Add Sema icon before Markdown icon
        const markdownIcon = document.getElementsByClassName(
          'tooltipped tooltipped-nw'
        );
        $(markdownIcon).after(SEMA_ICON_ANCHOR);
      }
    }
  },
  true
);
