import $ from 'cash-dom';
import {
  getTemplates,
  TEMPLATES_MAP,
  getImagesHTML,
  isTextBox,
  makeCommentTag,
} from './modules/content-util';

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
 * - todo: make it work via NPM
 * - todo: make template html in background.js to avoid fetching everytime?
 * - todo: better way to template, other than sandboxing
 * - todo: remove "Bulma Base" from bulma.css
 * - todo: toggle positive and negative tags of the same kind
 */

let currentSemabar;

function onTagClicked(event) {
  const target = event.target;
  $(target).toggleClass('sema-is-light sema-is-dark');
  if ($(target).hasClass('sema-is-dark') && currentSemabar) {
    makeCommentTag(currentSemabar, target);
  }
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
  currentSemabar = event.target.parentElement;
  $('#addTagsModal').addClass('sema-is-active');
}

$(async function () {
  console.log('Starting...');
  currentSemabar = null;

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
        // todo: remove mutation listener from the newly added element so that it doesnot trigger updates
        // todo: dont do this!!!
        // todo: safetly remove listeners?
        $('.semaAddTag').on('click', (event) => {
          showAddTagModal(event);
        });
      }
    }
  };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
});
