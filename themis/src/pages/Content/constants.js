export const { SEMA_LANDING_URL } = process.env;
export const { SEMA_PRODUCTION_URL } = process.env;
export const { SEMA_URL } = process.env;
export const { SEMA_UI_URL } = process.env;
export const { SEMA_COOKIE_NAME } = process.env;
export const { SEMA_COOKIE_DOMAIN } = process.env;
export const { SEMA_CLIENT_ID } = process.env;
export const { SEMA_CLIENT_SECRET } = process.env;
export const { AMPLITUDE_API_KEY } = process.env;

export const SEMA_LOGO_URL = `${SEMA_PRODUCTION_URL}/img/sema-tray-logo.svg`;
export const SEMA_LANDING_FAQ = `${SEMA_LANDING_URL}/faq`;
export const SEMA_LANDING_FAQ_TAGS = `${SEMA_LANDING_FAQ}#what-do-tags-mean`;
export const SEMA_LANDING_GITHUB = `${SEMA_LANDING_URL}/gh`;
export const SUGGESTION_URL = `${SEMA_URL}/v1/comments/suggested?q=`;
export const SEMA_WEB_LOGIN = `${SEMA_UI_URL}/login`;
export const SEMA_WEB_COLLECTIONS = `${SEMA_UI_URL}/snippets`;
export const SEMA_ENG_GUIDE_UI_URL = `${SEMA_UI_URL}/guides`;
export const SMART_COMMENT_URL = `${SEMA_URL}/v1/comments/smart`;
export const SUGGESTED_COMMENTS_URL = `${SEMA_URL}/v1/comments/suggested`;
export const COLLECTIONS_URL = `${SEMA_URL}/v1/comments/collections`;
export const TAGS_URL = `${SEMA_URL}/v1/comments/tags/suggested-comment`;
export const USERS_URL = `${SEMA_URL}/v1/users`;
export const TEAMS_URL = `${SEMA_URL}/v1/teams`;
export const ADD_OP = 'ADD_OP';
export const DELETE_OP = 'DELETE_OP';
export const TOGGLE_OP = 'TOGGLE_OP';
export const POSITIVE = 'positive';
export const NEGATIVE = 'negative';
export const SELECTED = 'selected';
export const IS_DIRTY = 'isDirty';

export const TAGS_INIT = [
  {
    [POSITIVE]: 'Readable',
    [NEGATIVE]: 'Unreadable',
    [SELECTED]: null,
    [IS_DIRTY]: false,
  },
  {
    [POSITIVE]: 'Secure',
    [NEGATIVE]: 'Not secure',
    [SELECTED]: null,
    [IS_DIRTY]: false,
  },
  {
    [POSITIVE]: 'Efficient',
    [NEGATIVE]: 'Inefficient',
    [SELECTED]: null,
    [IS_DIRTY]: false,
  },
  {
    [POSITIVE]: 'Elegant',
    [NEGATIVE]: 'Inelegant',
    [SELECTED]: null,
    [IS_DIRTY]: false,
  },
  {
    [POSITIVE]: 'Reusable',
    [NEGATIVE]: 'Not reusable',
    [SELECTED]: null,
    [IS_DIRTY]: false,
  },
  {
    [POSITIVE]: 'Fault-tolerant',
    [NEGATIVE]: 'Brittle',
    [SELECTED]: null,
    [IS_DIRTY]: false,
  },
  {
    [POSITIVE]: 'Maintainable',
    [NEGATIVE]: 'Not maintainable',
    [SELECTED]: null,
    [IS_DIRTY]: false,
  },
];

export const TAGS_ON_DB = [
  {
    label: 'Readable',
    _id: '607f0594ab1bc1aecbe2ce4b',
  },
  {
    label: 'Unreadable',
    _id: '607f0594ab1bc1aecbe2ce4c',
  },
  {
    label: 'Secure',
    _id: '607f0594ab1bc1aecbe2ce4d',
  },
  {
    label: 'Not secure',
    _id: '607f0594ab1bc1aecbe2ce4e',
  },
  {
    label: 'Efficient',
    _id: '607f0594ab1bc1aecbe2ce4f',
  },
  {
    label: 'Inefficient',
    _id: '607f0594ab1bc1aecbe2ce50',
  },
  {
    label: 'Elegant',
    _id: '607f0594ab1bc1aecbe2ce51',
  },
  {
    label: 'Inelegant',
    _id: '607f0594ab1bc1aecbe2ce52',
  },
  {
    label: 'Reusable',
    _id: '607f0594ab1bc1aecbe2ce53',
  },
  {
    label: 'Not reusable',
    _id: '607f0594ab1bc1aecbe2ce54',
  },
  {
    label: 'Fault-tolerant',
    _id: '607f0594ab1bc1aecbe2ce55',
  },
  {
    label: 'Brittle',
    _id: '607f0594ab1bc1aecbe2ce56',
  },
  {
    label: 'Maintainable',
    _id: '607f0594ab1bc1aecbe2ce57',
  },
  {
    label: 'Not maintainable',
    _id: '607f0594ab1bc1aecbe2ce58',
  },
];

export const EMOJIS_ID = {
  NO_REACTION: '607f0d1ed7f45b000ec2ed70',
  AWESOME: '607f0d1ed7f45b000ec2ed71',
  GOOD: '607f0d1ed7f45b000ec2ed72',
  QUESTION: '607f0d1ed7f45b000ec2ed73',
  FIX: '607f0d1ed7f45b000ec2ed74',
};

export const EMOJIS = [
  {
    _id: EMOJIS_ID.NO_REACTION,
    title: 'No reaction',
    emoji: '⚪',
    github_emoji: ':white_circle:',
  },
  {
    _id: EMOJIS_ID.AWESOME,
    title: 'This code is <b>awesome</b>',
    emoji: '🏆',
    github_emoji: ':trophy:',
  },
  {
    _id: EMOJIS_ID.GOOD,
    title: 'This code <b>looks good</b>',
    emoji: '👌',
    github_emoji: ':ok_hand:',
  },
  {
    _id: EMOJIS_ID.QUESTION,
    title: 'I have a <b>question</b>',
    emoji: '❓',
    github_emoji: ':question:',
  },
  {
    _id: EMOJIS_ID.FIX,
    title: 'This code <b>needs a fix</b>',
    emoji: '🛠',
    github_emoji: ':hammer_and_wrench:',
  },
];

export const USER = {
  isActive: false,
  isVerified: false,
  isWaitlist: true,
  termsAccepted: true,
  username: 'dave@semasoftware.com',
  password: null,
  firstName: 'Dave',
  lastName: 'Mustaine',
  jobTitle: 'Engineer',
  avatarUrl: 'https://avatars.githubusercontent.com/u/82075558?v=4',
  identities: [
    {
      provider: 'github',
      id: '82075558',
      username: 'davemustaine',
      email: 'dave@semasoftware.com',
      firstName: 'Matt',
      lastName: 'Mustaine',
      profileUrl: 'https://api.github.com/users/davemustaine',
      avatarUrl: 'https://avatars.githubusercontent.com/u/82075558?v=4',
    },
  ],
  verificationToken: null,
  verificationExpires: null,
  termsAcceptedAt: '2020-05-12T13:53:10.734Z',
  organizations: [
    {
      isActive: true,
      isAdmin: true,
      id: '82075564',
      orgName: 'Sema',
    },
  ],
  _id: '6076262a407c64f11499537a',
};

export const SEMA_REACTION_REGEX = /\*\*Summary:\*\*([ \w : |])*/s;
export const SEMA_TAGS_REGEX = /\*\*Tags:\*\*([ \w : | ,])*/s;

export const SEMA_ICON_ANCHOR_LIGHT = `
  <span class='tooltipped tooltipped-nw' style='position: absolute; right: 35px' aria-label='Sema Smart Comments enabled'>
    <a class='Link--muted position-relative d-inline' href='https://semasoftware.com/' target='_blank' aria-label='Learn about Sema smart comments'>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.02037 13H14.9796C15.5323 13 16 12.5168 16 11.9458V4.05417C16 3.46852 15.5465 3 14.9796 3H1.02037C0.453499 3 0 3.46852 0 4.05417V11.9458C0 12.5315 0.453499 13 1.02037 13ZM3 11.75L4.87904 4.25H7.0625L5.16954 11.75H3ZM10.8056 4.75L10.9773 6.88721L12.9176 6.36638L13.3125 7.62356L11.3894 8.41379L12.5742 10.2457L11.6813 11L10.2562 9.31178L8.76236 11L7.83517 10.2816L9.00275 8.41379L7.0625 7.62356L7.40591 6.33046L9.46635 6.88721L9.63805 4.75H10.8056Z" fill="#586069"/>
      </svg>
    </a>
  </span>
`;

export const SEMA_ICON_ANCHOR_DARK = `
  <span class='tooltipped tooltipped-nw' style='position: absolute; right: 35px' aria-label='Sema Smart Comments enabled'>
    <a class='Link--muted position-relative d-inline' href='https://semasoftware.com/' target='_blank' aria-label='Learn about Sema smart comments'>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.02037 13H14.9796C15.5323 13 16 12.5168 16 11.9458V4.05417C16 3.46852 15.5465 3 14.9796 3H1.02037C0.453499 3 0 3.46852 0 4.05417V11.9458C0 12.5315 0.453499 13 1.02037 13ZM3 11.75L4.87904 4.25H7.0625L5.16954 11.75H3ZM10.8056 4.75L10.9773 6.88721L12.9176 6.36638L13.3125 7.62356L11.3894 8.41379L12.5742 10.2457L11.6813 11L10.2562 9.31178L8.76236 11L7.83517 10.2816L9.00275 8.41379L7.0625 7.62356L7.40591 6.33046L9.46635 6.88721L9.63805 4.75H10.8056Z" fill="#8b949e"/>
      </svg>
    </a>
  </span>
`;

export const SEMA_ICON_ANCHOR_DARK_DIMMED = `
  <span class='tooltipped tooltipped-nw' style='position: absolute; right: 35px' aria-label='Sema Smart Comments enabled'>
    <a class='Link--muted position-relative d-inline' href='https://semasoftware.com/' target='_blank' aria-label='Learn about Sema smart comments'>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.02037 13H14.9796C15.5323 13 16 12.5168 16 11.9458V4.05417C16 3.46852 15.5465 3 14.9796 3H1.02037C0.453499 3 0 3.46852 0 4.05417V11.9458C0 12.5315 0.453499 13 1.02037 13ZM3 11.75L4.87904 4.25H7.0625L5.16954 11.75H3ZM10.8056 4.75L10.9773 6.88721L12.9176 6.36638L13.3125 7.62356L11.3894 8.41379L12.5742 10.2457L11.6813 11L10.2562 9.31178L8.76236 11L7.83517 10.2816L9.00275 8.41379L7.0625 7.62356L7.40591 6.33046L9.46635 6.88721L9.63805 4.75H10.8056Z" fill="#768390"/>
      </svg>
    </a>
  </span>
`;

export const SEMA_ICON_ANCHOR_DARK_HIGH_CONTRAST = `
  <span class='tooltipped tooltipped-nw' style='position: absolute; right: 35px' aria-label='Sema Smart Comments enabled'>
    <a class='Link--muted position-relative d-inline' href='https://semasoftware.com/' target='_blank' aria-label='Learn about Sema smart comments'>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.02037 13H14.9796C15.5323 13 16 12.5168 16 11.9458V4.05417C16 3.46852 15.5465 3 14.9796 3H1.02037C0.453499 3 0 3.46852 0 4.05417V11.9458C0 12.5315 0.453499 13 1.02037 13ZM3 11.75L4.87904 4.25H7.0625L5.16954 11.75H3ZM10.8056 4.75L10.9773 6.88721L12.9176 6.36638L13.3125 7.62356L11.3894 8.41379L12.5742 10.2457L11.6813 11L10.2562 9.31178L8.76236 11L7.83517 10.2816L9.00275 8.41379L7.0625 7.62356L7.40591 6.33046L9.46635 6.88721L9.63805 4.75H10.8056Z" fill="#f0f3f6"/>
      </svg>
    </a>
  </span>
`;

export const SEMABAR_CLASS = 'sema';
export const SEMA_SEARCH_CLASS = 'sema-search';
export const DEFAULT_COLLECTION_NAME = 'my snippets';

// TODO: this will need to change. modal is not global
export const GLOBAL_SEMA_SEARCH_ID = 'globalSemaSearch';
export const ON_INPUT_DEBOUCE_INTERVAL_MS = 250;
export const CALCULATION_ANIMATION_DURATION_MS = 1000;

export const SUGGESTED_TAG_LIMIT = 3;

export const WHOAMI = 'whoami';
export const FIXED_GITHUB_TEXTAREA_ID = 'new_comment_field';

export const LIGHT = 'light';
export const DARK = 'dark';
export const DARK_DIMMED = 'dark_dimmed';
export const DARK_HIGH_CONTRAST = 'dark_high_contrast';

export const IS_HIGHLIGHTS_ACTIVE = process.env.SEMA_HIGHLIGHTS_OFF !== 'true';

export const SEMA_REMINDER_ROOT_ID = 'sema-reminder-root';

export const SEMA_REMINDER_SESSION_STORAGE_KEY = 'semaReminderClosed';

export const DELIMITERS = [',', '.', ' ', ';', '\n'];
export const EVENTS = {
  INSTALLED_EXTENSION: 'INSTALLED_EXTENSION',
  UNINSTALLED_EXTENSION: 'UNINSTALLED_EXTENSION',
  UPDATED_EXTENSION: 'UPDATED_EXTENSION',
  VIEWED_GITHUB_PAGE: 'VIEWED_GITHUB_PAGE',
  CREATE_SMART_COMMENT: 'CREATE_SMART_COMMENT',
  CLICKED_COMMENT_LIBRARY_BAR: 'CLICKED_COMMENT_LIBRARY_BAR',
  CLICKED_REACTION: 'CLICKED_REACTION',
  CLICKED_ADD_TAGS: 'CLICKED_ADD_TAGS',
  CLICKED_SAVE_TO_MY_COMMENTS: 'CLICKED_SAVE_TO_MY_COMMENTS',
  LOGIN_TOASTER_SHOWED: 'LOGIN_TOASTER_SHOWED',
  CLICKED_LOGIN_TOASTER: 'CLICKED_LOGIN_TOASTER',
};

export const SEMA_TEXTAREA_IDENTIFIER = 'sema-identifier';
export const DEFAULT_PROFILE_NAME = 'Personal';
export const STORAGE_ITEMS = {
  PROFILE: 'profile',
};
