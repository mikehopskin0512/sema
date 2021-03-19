import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import $ from 'cash-dom';

import {
  isValidSemaTextBox,
  getInitialSemaValues,
  onGithubSubmitClicked,
  onCloseAllModalsClicked,
} from './modules/content-util';

import { SEMA_ICON_ANCHOR } from './constants';

import { suggest } from './modules/commentSuggestions';
import Semabar from './Semabar.jsx';
import Searchbar from './Searchbar.jsx';

import store from './modules/redux/store';

import { addSemabar } from './modules/redux/action';

store.subscribe(() => {
  console.log('State changed!');
  console.log(store.getState());
});

window.addEventListener(
  'click',
  onGithubSubmitClicked,
  // adding listener in the "capturing" phase
  true
);

window.addEventListener(
  'click',
  (event) => {
    onCloseAllModalsClicked(event, store);
  },
  false
);

/**
 * Register MutationObserver
 * - todo: try to listen to as less mutation as possible
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
        // todo: remove mutation listener from the newly added element so that it doesnot trigger updates
        const idSuffix = Date.now();
        const semabarContainerId = `semabar${idSuffix}`;
        const semaSearchContainerId = `semasearch${idSuffix}`;

        $(activeElement).after(
          `<div id=${semabarContainerId} class='sema'></div>`
        );
        const addedSemaElement = $(activeElement).siblings('div.sema')[0];

        // ABHISHEK
        const { initialTags, initialReaction } = getInitialSemaValues(
          activeElement
        );

        store.dispatch(addSemabar({ id: semabarContainerId, activeElement }));
        // Render initial Semabar
        ReactDOM.render(
          <Provider store={store}>
            <Semabar id={semabarContainerId} />
          </Provider>,
          addedSemaElement
        );

        // Get suggested reactions and tags based in input text (after every space)
        let suggestedReaction = '';
        let suggestedTags = [];

        // ABHISHEK: REMOVE THIS
        document.addEventListener('keyup', (event) => {
          if (event.code === 'Space') {
            const payload = suggest(activeElement.value);
            ({ suggestedReaction, suggestedTags } = payload);

            if (suggestedReaction || suggestedTags) {
              ReactDOM.render(
                <Semabar
                  initialTags={initialTags}
                  initialReaction={suggestedReaction || initialReaction}
                />,
                addedSemaElement
              );
            }
          }
        });

        $(activeElement).before(
          `<div id=${semaSearchContainerId} class='sema-search sema-mt-2 sema-mb-2'></div>`
        );
        const searchContainer = $(activeElement).siblings('div.sema-search')[0];
        ReactDOM.render(
          <Searchbar id={semaSearchContainerId} commentBox={activeElement} />,
          searchContainer
        );
      }
    }
  };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
});
