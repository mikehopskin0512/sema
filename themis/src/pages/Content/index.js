import $ from 'cash-dom';
import {
  getTemplates,
  TEMPLATES_MAP,
  getImagesHTML,
  isTextBox,
} from './modules/content-util';

import {
  makeCommentTags,
  populateModalWithCurrentTags,
  togglePositiveNegativeTags,
} from './modules/tag-util';

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

let semaTagContainer;

function onTagClicked(event) {
  const target = event.target;
  togglePositiveNegativeTags(target);
  makeCommentTags(semaTagContainer);
}

function addTagModalToDOM(semamodalHTML) {
  const modal = $('#addTagsModal');
  if (!modal.get(0)) {
    // modal doesnot exist in the DOM
    $(semamodalHTML).appendTo(document.body);
    $('#sema-modal-close').on('click', function () {
      $('#addTagsModal').removeClass('sema-is-active');
    });
    $('#tagsPositiveContainer > span').on('click', onTagClicked);
    $('#tagsNegativeContainer > span').on('click', onTagClicked);
  }
}

function showAddTagModal(event) {
  event.preventDefault();
  const target = event.target;
  // clicking on the icon in the button causes the parent to be the button itself
  // so take the top parent and then get ".sema-tag-container" element
  const topParent = $(target).parentsUntil('.sema');
  semaTagContainer = topParent.get(topParent.length - 1);
  $('#addTagsModal').addClass('sema-is-active');
  populateModalWithCurrentTags(semaTagContainer);
}

$(async function () {
  console.log('Starting...');
  semaTagContainer = null;

  const allTemplates = await getTemplates();
  const mapTemplates = Object.keys(TEMPLATES_MAP).reduce((acc, curr, index) => {
    acc[curr] = allTemplates[index];
    return acc;
  }, {});

  const semabarHTML = getImagesHTML(mapTemplates['semabar']);
  const semamodalHTML = mapTemplates['semamodal'];
  console.log('Received template');

  addTagModalToDOM(semamodalHTML);

  const targetNode = document.getElementsByTagName('body')[0];
  const config = { subtree: true, childList: true, attributes: true };

  const callback = function (mutationList, observer) {
    console.log('Observed!');
    const activeElement = document.activeElement;
    if (isTextBox(activeElement)) {
      const semaElements = $(activeElement).siblings('div.sema');
      if (!semaElements[0]) {
        $(activeElement).after(semabarHTML);
        const addedSemaElement = $(activeElement).siblings('div.sema')[0];
        // todo: remove mutation listener from the newly added element so that it doesnot trigger updates
        // todo: dont do this!!!
        // todo: safetly remove listeners?
        const semaAddTag = $(addedSemaElement).find(
          '.sema-tag-container .semaAddTag'
        )[0];
        $(semaAddTag).on('click', showAddTagModal);

        const selectedEmoji = $(addedSemaElement).find('.selectedEmoji')[0];
        $(selectedEmoji).on('click', onCollapsedEmojiSelection);

        const emojis = $(addedSemaElement).find('.expandedEmojis button');
        $(emojis).on('click', onExpandedEmojiSelected);
      }
    }
  };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
});
