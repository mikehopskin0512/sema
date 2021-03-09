import React from 'react';
import ReactDOM from 'react-dom';

import $ from 'cash-dom';
import { getImagesHTML, isTextBox } from './modules/content-util';

import Semabar from './Semabar.jsx';

import {
  onCollapsedEmojiSelection,
  onExpandedEmojiSelected,
} from './modules/emoji-util';

console.log('main script working!!!');

/**
 * Register MutationObserver
 * - todo: try to listen to as less mutation as possible
 * on mutation -> get currrently focussed element
 * if document.activeElement instanceof textarea
 * remove old sema elements from dom on focus change
 * - todo
 * append new sema elements to DOM
 * - todo: donot change DOM for existing textbox, might cause issues with DOM updaters like Reactjs
 * - todo: make template html in background.js to avoid fetching everytime?
 * - todo: better way to template, other than sandboxing
 * - todo: remove "Bulma Base" from bulma.css
 */

$(async function () {
  console.log('Starting...');

  const targetNode = document.getElementsByTagName('body')[0];
  const config = { subtree: true, childList: true, attributes: true };

  const callback = function (mutationList, observer) {
    console.log('Observed!');
    const activeElement = document.activeElement;
    if (isTextBox(activeElement)) {
      const semaElements = $(activeElement).siblings('div.sema');
      if (!semaElements[0]) {
        // todo: remove mutation listener from the newly added element so that it doesnot trigger updates

        $(activeElement).after("<div class='sema sema-mt-2'>");
        const addedSemaElement = $(activeElement).siblings('div.sema')[0];
        ReactDOM.render(<Semabar />, addedSemaElement);
      }
    }
  };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
});
