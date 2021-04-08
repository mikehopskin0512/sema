/**
 * - todo: remove "Bulma Base" from bulma.css
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import $ from 'cash-dom';

import {
  isValidSemaTextBox,
  onDocumentClicked,
  onSuggestion,
  getSemaIds,
} from './modules/content-util';

import {
  SEMA_ICON_ANCHOR,
  SEMABAR_CLASS,
  SEMA_SEARCH_CLASS,
} from './constants';

import Semabar from './Semabar.jsx';
import Searchbar from './Searchbar.jsx';
import Mirror from './Mirror';

import store from './modules/redux/store';

import {
  addSemaComponents,
  toggleGlobalSearchModal,
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
 * when "SPACE" is detected on "keyup" event, then generate suggestions for reaction and tags
 */
document.addEventListener('keyup', (event) => onSuggestion(event, store));

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
        const idSuffix = Date.now();

        const { semabarContainerId, semaSearchContainerId } = getSemaIds(
          idSuffix
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
              if (t.trim().length > 0 && t.trim().length % 2 === 0) {
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
