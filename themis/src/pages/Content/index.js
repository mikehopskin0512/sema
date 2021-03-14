import React from 'react';
import ReactDOM from 'react-dom';

import $ from 'cash-dom';
import {
  isValidSemaTextBox,
  getSemaGithubText,
  getInitialSemaValues,
} from './modules/content-util';
import { EMOJIS, SEMA_GITHUB_REGEX } from './constants';

import { suggest } from './commentSuggestions';
import Semabar from './Semabar.jsx';
import Searchbar from './Searchbar.jsx';
// import SemaIcon from './modules/semaIcon.js';

// Add Sema icon before Markdown icon
$(function () {
  const markdownIcon = document.getElementsByClassName("tooltipped tooltipped-nw");
  $(markdownIcon).after(
    "<span class='tooltipped tooltipped-nw' style='position: absolute; right: 35px' aria-label='Sema Smart Comments enabled'> " +
      "<a href='https://semasoftware.com/' target='_blank' aria-label='Learn about Sema smart comments'>" +
        "<svg width='16' height='11' viewBox='0 0 16 11' fill='none' xmlns='http://www.w3.org/2000/svg'><rect width='16' height='11' rx='2' fill='#586069'/>" +
        "<path d='M7.898 9.081C7.418 9.081 6.944 9.018 6.476 8.892C6.008 8.766 5.627 8.595 5.333 8.379L5.864 7.182C6.176 7.38 6.506 7.533 6.854 7.641C7.208 7.743 7.562 7.794 7.916 7.794C8.276 7.794 8.552 7.746 8.744 7.65C8.936 7.548 9.032 7.407 9.032 7.227C9.032 7.065 8.945 6.933 8.771 6.831C8.597 6.723 8.27 6.618 7.79 6.516C7.184 6.396 6.713 6.249 6.377 6.075C6.041 5.895 5.804 5.685 5.666 5.445C5.534 5.205 5.468 4.914 5.468 4.572C5.468 4.182 5.579 3.831 5.801 3.519C6.023 3.201 6.335 2.955 6.737 2.781C7.139 2.601 7.598 2.511 8.114 2.511C8.576 2.511 9.023 2.577 9.455 2.709C9.893 2.835 10.235 3.003 10.481 3.213L9.959 4.41C9.677 4.212 9.38 4.062 9.068 3.96C8.756 3.852 8.444 3.798 8.132 3.798C7.826 3.798 7.58 3.858 7.394 3.978C7.208 4.092 7.115 4.248 7.115 4.446C7.115 4.554 7.148 4.644 7.214 4.716C7.28 4.788 7.403 4.86 7.583 4.932C7.763 4.998 8.033 5.07 8.393 5.148C8.975 5.274 9.431 5.427 9.761 5.607C10.097 5.781 10.334 5.988 10.472 6.228C10.61 6.462 10.679 6.744 10.679 7.074C10.679 7.698 10.436 8.19 9.95 8.55C9.464 8.904 8.78 9.081 7.898 9.081Z' fill='white'/>" +
        "</svg>" +
      "</a>" +
    "</span>"
  );
});

window.addEventListener(
  'click',
  function (event) {
    const target = event.target;
    const parentButton = $(target).parents('button')?.[0];
    const isButton = $(target).is('button') || $(parentButton).is('button');
    const isSubmitButton =
      isButton &&
      ($(target).attr('type') === 'submit' ||
        $(parentButton).attr('type') === 'submit');

    if (isSubmitButton) {
      const formParent = $(target).parents('form')?.[0];
      const textarea = $(formParent).find(
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
        if (selectedTagsString.length === 0) {selectedTagsString = ' None' }

        let semaString = getSemaGithubText(
          selectedEmojiString,
          selectedTagsString
        );

        let textboxValue = textarea.value;

        if (textboxValue.includes('Sema Reaction')) {
          // this textbox already has sema text
          // this is an edit
          textboxValue = textboxValue.replace(SEMA_GITHUB_REGEX, '');
        } else {
          semaString = `\n---${semaString}`;
        }

        textarea.value = `${textboxValue}\n${semaString}`;
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

        $(activeElement).after("<div class='sema'></div>");
        const addedSemaElement = $(activeElement).siblings('div.sema')[0];

        const { initialTags, initialReaction } = getInitialSemaValues(
          activeElement
        );

        // Render initial Semabar
        ReactDOM.render(
          <Semabar initialTags={initialTags} initialReaction={initialReaction} />,
          addedSemaElement
        );

        // Get suggested reactions and tags based in input text (after every space)
        let suggestedReaction = '';
        let suggestedTags = [];
        document.addEventListener('keyup', event => {
          if (event.code === 'Space') {
            const payload = suggest(activeElement.value);
            ({ suggestedReaction, suggestedTags } = payload);

            if (suggestedReaction || suggestedTags) {
              ReactDOM.render(
                <Semabar initialTags={initialTags} initialReaction={suggestedReaction || initialReaction} />,
                addedSemaElement
              );
            }
          }
        })

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
