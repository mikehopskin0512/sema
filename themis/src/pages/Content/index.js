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
} from './modules/content-util';

import {
  SEMA_ICON_ANCHOR,
  SEMABAR_CLASS,
  SEMA_SEARCH_CLASS,
  ON_INPUT_DEBOUCE_INTERVAL_MS,
} from './constants';

import Semabar from './Semabar.jsx';
import Searchbar from './Searchbar.jsx';

import store from './modules/redux/store';

import {
  addSemaComponents,
  updateSemaComponents,
} from './modules/redux/action';

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
        const idSuffix = $(activeElement).attr('id');

        const { semabarContainerId, semaSearchContainerId } = getSemaIds(
          idSuffix
        );

        $(activeElement).on(
          'input',
          debounce((event) => {
            onSuggestion(event, store);
          }, ON_INPUT_DEBOUCE_INTERVAL_MS)
        );
        $(activeElement).on('input', () => {
          const { semabars } = store.getState();
          store.dispatch(
            updateSemaComponents({
              Id: semabarContainerId,
              typeFlag: false,
            })
          );
          if (semabars[semabarContainerId].isReactionDirty === true) {
            store.dispatch(
              updateSemaComponents({
                Id: semabarContainerId,
                typeFlag: true,
              })
            );
          }
        });
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
            seedId: idSuffix,
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
