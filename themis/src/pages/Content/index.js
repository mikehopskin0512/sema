import React from 'react';
import ReactDOM from 'react-dom';

import $ from 'cash-dom';
import {
  isValidSemaTextBox,
  getSemaGithubText,
  getInitialSemaValues,
} from './modules/content-util';
import { EMOJIS, SEMA_GITHUB_REGEX } from './constants';

import Semabar from './Semabar.jsx';
import Searchbar from './Searchbar.jsx';

window.addEventListener(
  'click',
  function (event) {
    const target = event.target;
    const parentButton = $(target).parents('button')?.[0];
    const isButton = $(target).is('button') || $(parentButton).is('button');
    const isSumbitButton =
      isButton &&
      ($(target).attr('type') === 'submit' ||
        $(parentButton).attr('type') === 'submit');

    if (isSumbitButton) {
      const commentParent = $(target).parentsUntil(
        'div.inline-comment-form',
        'form.js-inline-comment-form'
      )?.[0];

      const updateCommentParent = $(target).parentsUntil(
        'form',
        'div.js-previewable-comment-form'
      )?.[0];

      const textarea =
        $(commentParent).find(
          'tab-container file-attachment div text-expander textarea'
        )?.[0] ||
        $(updateCommentParent).find(
          'file-attachment div text-expander textarea'
        )?.[0];
      if (textarea) {
        const semabar = $(textarea).siblings('div.sema')?.[0];
        const semaChildren = $(semabar).children();

        const emojiContainer = semaChildren?.[0];
        const tagContainer = semaChildren?.[1];

        const selectedEmoji = $(emojiContainer).children()?.[0]?.textContent;
        const selectedTags = $(tagContainer)
          .children('.sema-tag')
          .map((index, tagElement) => tagElement?.textContent);

        const selectedEmojiObj = EMOJIS.find((emoji) =>
          selectedEmoji?.includes(emoji.title)
        );

        const selectedEmojiString = `${selectedEmojiObj?.github_emoji} ${selectedEmojiObj?.title}`;

        let selectedTagsString = '';
        selectedTags.each((index, tag) => {
          selectedTagsString = `${selectedTagsString}${
            index > 0 ? ',' : ''
          } ${tag}`;
        });

        const semaString = getSemaGithubText(
          selectedEmojiString,
          selectedTagsString
        );

        let textboxValue = textarea.value;

        if (textboxValue.includes('Sema Reaction')) {
          // this textbox already has sema text
          // this is an edit
          textboxValue = textboxValue.replace(SEMA_GITHUB_REGEX, '');
        }

        textarea.value = `${textboxValue}${semaString}`;
      }
    }
  },
  // adding listener in the "capturing" phase
  true
);

/**
 * Register MutationObserver
 * - todo: try to listen to as less mutation as possible
 * - todo: remove "Bulma Base" from bulma.css
 */

$(async function () {
  const targetNode = document.getElementsByTagName('body')[0];
  const config = { subtree: true, childList: true, attributes: true };

  const callback = function (mutationList, observer) {
    const activeElement = document.activeElement;
    if (isValidSemaTextBox(activeElement)) {
      const semaElements = $(activeElement).siblings('div.sema');
      if (!semaElements[0]) {
        // todo: remove mutation listener from the newly added element so that it doesnot trigger updates

        $(activeElement).after("<div class='sema sema-mt-2'></div>");
        const addedSemaElement = $(activeElement).siblings('div.sema')[0];

        const { initialTags, initialEmoji } = getInitialSemaValues(
          activeElement
        );

        ReactDOM.render(
          <Semabar initialTags={initialTags} initialEmoji={initialEmoji} />,
          addedSemaElement
        );

        $(activeElement).before(
          "<div class='sema-search sema-mt-2 sema-mb-2'></div>"
        );
        const searchContainer = $(activeElement).siblings('div.sema-search')[0];
        ReactDOM.render(
          <Searchbar commentBox={activeElement} />,
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
