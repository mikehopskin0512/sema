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
