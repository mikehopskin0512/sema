import $ from 'cash-dom';
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
const {
  runtime: { getURL },
} = chrome;

const IMAGES_MAP = {
  sema_trophy: '/img/emoji_trophy.png',
  sema_ok: '/img/emoji_ok.png',
  sema_question: '/img/emoji_question.png',
  sema_tools: '/img/emoji_fix.png',
  sema_none: '/img/emoji_none.png',
  sema_tag: '/img/price-tags.svg',
};

const TEMPLATES_MAP = {
  semabar: '/templates/semabar.html',
  semamodal: '/templates/semamodal.html',
};

const getTemplates = () => {
  const templatePromises = Object.keys(TEMPLATES_MAP).map((templateKey) => {
    const url = getURL(TEMPLATES_MAP[templateKey]);
    return fetch(url).then((response) => response.text());
  });

  return Promise.all(templatePromises);
};

const getImagesHTML = (rawHTML) => {
  const keys = Object.keys(IMAGES_MAP);
  let imgHTML = rawHTML;
  keys.forEach((key) => {
    imgHTML = imgHTML.replace(key, getURL(IMAGES_MAP[key]));
  });
  return imgHTML;
};

function isTextBox(element) {
  var tagName = element.tagName.toLowerCase();
  if (tagName === 'textarea') return true;
  if (tagName !== 'input') return false;
  var type = element.getAttribute('type').toLowerCase(),
    // if any of these input types is not supported by a browser, it will behave as input type text.
    inputTypes = [
      'text',
      'password',
      'number',
      'email',
      'tel',
      'url',
      'search',
      'date',
      'datetime',
      'datetime-local',
      'time',
      'month',
      'week',
    ];
  return inputTypes.indexOf(type) >= 0;
}

function showAddTagModal(event, semamodalHTML) {
  event.preventDefault();

  const modal = $('#addTagsModal');
  if (!modal.get(0)) {
    // modal doesnot exist in the DOM
    $(semamodalHTML).appendTo(document.body);
    $('#sema-modal-close').on('click', function () {
      $('#addTagsModal').removeClass('sema-is-active');
    });
    $('#tagsPositiveContainer > span').on('click', function (event) {
      const target = event.target;
      $(target).toggleClass('sema-is-light sema-is-dark');
      console.log('tag clicked');
    });

    $('#tagsNegativeContainer > span').on('click', function (event) {
      const target = event.target;
      $(target).toggleClass('sema-is-light sema-is-dark');
      console.log('tag clicked');
    });
  }

  $('#addTagsModal').addClass('sema-is-active');
}

$(async function () {
  console.log('Starting...');

  const allTemplates = await getTemplates();
  const mapTemplates = Object.keys(TEMPLATES_MAP).reduce((acc, curr, index) => {
    acc[curr] = allTemplates[index];
    return acc;
  }, {});

  const semabarHTML = getImagesHTML(mapTemplates['semabar']);
  const semamodalHTML = mapTemplates['semamodal'];
  console.log('Received template');

  const targetNode = document.getElementsByTagName('body')[0];
  const config = { subtree: true, childList: true, attributes: true };

  const callback = function (mutationList, observer) {
    console.log('Observed!');
    const activeElement = document.activeElement;
    if (isTextBox(activeElement)) {
      const semaElements = $(activeElement).siblings('div.sema');
      if (!semaElements[0]) {
        $(activeElement).after(semabarHTML);

        // todo: dont do this!!!
        // todo: safetly remove listeners?
        $('#semaAddTag').on('click', (event) => {
          showAddTagModal(event, semamodalHTML);
        });
      }
    }
  };
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
});
