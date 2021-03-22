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

import store from './modules/redux/store';

import { addSemaComponents } from './modules/redux/action';

document.addEventListener(
  'click',
  (event) => {
    onDocumentClicked(event, store);
  },
  // adding listener in the "capturing" phase
  true
);

document.addEventListener('keyup', (event) => onSuggestion(event, store));

/**
 * Register MutationObserver
 * - todo: try to listen to as less mutation as possible
 * - todo: remove mutation listener from the newly added element so that it doesnot trigger updates
 * - todo: remove "Bulma Base" from bulma.css
 */

$(async function () {
  const targetNode = document.getElementsByTagName('body')[0];
  const config = { subtree: true, childList: true, attributes: true };

  // Add Sema icon before Markdown icon
  $(function () {
    const markdownIcon = document.getElementsByClassName(
      'tooltipped tooltipped-nw'
    );
    $(markdownIcon).after(SEMA_ICON_ANCHOR);
  });

  const callback = function (mutationList, observer) {
    const activeElement = document.activeElement;
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
      }
    }
  };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
});
