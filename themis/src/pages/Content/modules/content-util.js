import $ from 'cash-dom';

const SELECTED_CLASS = 'sema-is-dark';
const UNSELECTED_CLASS = 'sema-is-light';
const TAGS_POSITIVE_CONTAINER = 'tagsPositiveContainer';
const TAGS_NEGATIVE_CONTAINER = 'tagsNegativeContainer';

const IMAGES_MAP = {
  sema_trophy: '/img/emoji_trophy.png',
  sema_ok: '/img/emoji_ok.png',
  sema_question: '/img/emoji_question.png',
  sema_tools: '/img/emoji_fix.png',
  sema_none: '/img/emoji_none.png',
  sema_tag: '/img/price-tags.svg',
};

export const TEMPLATES_MAP = {
  semabar: '/templates/semabar.html',
  semamodal: '/templates/semamodal.html',
};

const {
  runtime: { getURL },
} = chrome;

export const getTemplates = () => {
  const templatePromises = Object.keys(TEMPLATES_MAP).map((templateKey) => {
    const url = getURL(TEMPLATES_MAP[templateKey]);
    return fetch(url).then((response) => response.text());
  });

  return Promise.all(templatePromises);
};

export const getImagesHTML = (rawHTML) => {
  const keys = Object.keys(IMAGES_MAP);
  let imgHTML = rawHTML;
  keys.forEach((key) => {
    imgHTML = imgHTML.replace(key, getURL(IMAGES_MAP[key]));
  });
  return imgHTML;
};

export function isTextBox(element) {
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

function clearCommentTags(currentSemabar) {
  const tags = $(currentSemabar).children('span');
  tags.each((index) => $(tags[index]).remove());
}

export function makeCommentTags(currentSemabar) {
  clearCommentTags(currentSemabar);
  const selectedTags = getModalSelectedTags();

  selectedTags.forEach((val) => {
    const elem = $(`<span class="sema-tag ${SELECTED_CLASS} sema-is-rounded sema-mr-2">
      ${val}
      <button class="sema-delete sema-is-small"></button>
    </span>`);
    $(currentSemabar).append(elem);
    $(elem)
      .children('button')
      .on('click', function () {
        $(elem).remove();
      });
  });
}

export function togglePositiveNegativeTags(target) {
  // either both should be unselected
  // or only one should be selected
  const TOGGLE_CLASS = `${UNSELECTED_CLASS} ${SELECTED_CLASS}`;

  $(target).toggleClass(TOGGLE_CLASS);

  const targetParent = $(target).parent().get(0);
  const index = $(target).index();
  const isSelected = $(target).hasClass(SELECTED_CLASS);

  const isPositiveTag = $(targetParent).attr('id') === TAGS_POSITIVE_CONTAINER;
  const oppositeTagParent = isPositiveTag
    ? `#${TAGS_NEGATIVE_CONTAINER}`
    : `#${TAGS_POSITIVE_CONTAINER}`;

  const oppositeTag = $(oppositeTagParent).children().get(index);
  const isOppositeSelected = $(oppositeTag).hasClass(SELECTED_CLASS);

  if (isSelected && isOppositeSelected) {
    // if opposite is also selected
    // then unselect it
    $(oppositeTag).toggleClass(TOGGLE_CLASS);
  }
}

function getTagValues(tags) {
  const tagValues = [];
  tags.each((index) => {
    const tag = tags[index].innerText;
    tagValues.push(tag);
  });
  return tagValues;
}

function getModalSelectedTags() {
  const selectedModalTags = [];
  const positiveTags = $(`#${TAGS_POSITIVE_CONTAINER}`).children(
    `.${SELECTED_CLASS}`
  );
  const negativeTags = $(`#${TAGS_NEGATIVE_CONTAINER}`).children(
    `.${SELECTED_CLASS}`
  );
  const allTags = [
    ...getTagValues(positiveTags),
    ...getTagValues(negativeTags),
  ];
  return allTags;
}

export function populateModalWithCurrentTags(currentSemabar) {
  const semabarTagElements = $(currentSemabar).children('span');
  const tags = getTagValues(semabarTagElements);

  const positiveTags = $(`#${TAGS_POSITIVE_CONTAINER}`).children();
  const negativeTags = $(`#${TAGS_NEGATIVE_CONTAINER}`).children();

  const allModalTags = [...positiveTags, ...negativeTags];

  allModalTags.forEach((tagElem) => {
    const tagElemValue = tagElem.innerText;
    const exists = !!tags.find((tag) => tag === tagElemValue);
    if (exists) {
      $(tagElem).addClass(SELECTED_CLASS);
    } else {
      $(tagElem).removeClass(SELECTED_CLASS);
    }
  });
}
