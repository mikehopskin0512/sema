const SEMA_URL = process.env.SEMA_URL;

export const SUGGESTION_URL = `${SEMA_URL}/v1/comments/suggested?q=`;
export const CREATE_SMART_COMMENT_URL = `${SEMA_URL}/v1/comments/smart`;
export const ADD_OP = 'ADD_OP';
export const DELETE_OP = 'DELETE_OP';
export const TOGGLE_OP = 'TOGGLE_OP';
export const POSITIVE = 'positive';
export const NEGATIVE = 'negative';
export const SELECTED = 'selected';

export const MAX_CHARACTER_LENGTH = 88;

export const TAGS_INIT = [
  {
    [POSITIVE]: 'Readable',
    [NEGATIVE]: 'Unreadable',
    [SELECTED]: null,
  },
  {
    [POSITIVE]: 'Secure',
    [NEGATIVE]: 'Not secure',
    [SELECTED]: null,
  },
  {
    [POSITIVE]: 'Efficient',
    [NEGATIVE]: 'Inefficient',
    [SELECTED]: null,
  },
  {
    [POSITIVE]: 'Elegant',
    [NEGATIVE]: 'Inelegant',
    [SELECTED]: null,
  },
  {
    [POSITIVE]: 'Reusable',
    [NEGATIVE]: 'Not reusable',
    [SELECTED]: null,
  },
  {
    [POSITIVE]: 'Fault-tolerant',
    [NEGATIVE]: 'Brittle',
    [SELECTED]: null,
  },
  {
    [POSITIVE]: 'Maintainable',
    [NEGATIVE]: 'Not maintainable',
    [SELECTED]: null,
  },
];

export const TAGS_ON_DB = [
  {
      label: "Readable",
      _id: "607f0594ab1bc1aecbe2ce4b"
  },
  {
      label: "Unreadable",
      _id: "607f0594ab1bc1aecbe2ce4c"
  },
  {
      label: "Secure",
      _id: "607f0594ab1bc1aecbe2ce4d"
  },
  {
      label: "Not secure",
      _id: "607f0594ab1bc1aecbe2ce4e"
  },
  {
      label: "Efficient",
      _id: "607f0594ab1bc1aecbe2ce4f"
  },
  {
      label: "Inefficient",
      _id: "607f0594ab1bc1aecbe2ce50"
  },
  {
      label: "Elegant",
      _id: "607f0594ab1bc1aecbe2ce51"
  },
  {
      label: "Inelegant",
      _id: "607f0594ab1bc1aecbe2ce52"
  },
  {
      label: "Reusable",
      _id: "607f0594ab1bc1aecbe2ce53"
  },
  {
      label: "Not reusable",
      _id: "607f0594ab1bc1aecbe2ce54"
  },
  {
      label: "Fault-tolerant",
      _id: "607f0594ab1bc1aecbe2ce55"
  },
  {
      label: "Brittle",
      _id: "607f0594ab1bc1aecbe2ce56"
  },
  {
      label: "Maintainable",
      _id: "607f0594ab1bc1aecbe2ce57"
  },
  {
      label: "Not maintainable",
      _id: "607f0594ab1bc1aecbe2ce58"
  }
];

export const EMOJIS = [
  {
    _id: "607f0d1ed7f45b000ec2ed70",
    title: 'No reaction',
    emoji: '⚪',
    github_emoji: ':white_circle:',
  },
  {
    _id: "607f0d1ed7f45b000ec2ed71",
    title: 'Awesome',
    emoji: '🏆',
    github_emoji: ':trophy:',
  },
  {
    _id: "607f0d1ed7f45b000ec2ed72",
    title: 'Looks good',
    emoji: '👌',
    github_emoji: ':ok_hand:',
  },
  {
    _id: "607f0d1ed7f45b000ec2ed73",
    title: 'I have a question',
    emoji: '❓',
    github_emoji: ':question:',
  },
  {
    _id: "607f0d1ed7f45b000ec2ed74",
    title: 'Fix',
    emoji: '🛠',
    github_emoji: ':hammer_and_wrench:',
  },
];

export const USER = {
  isActive: false,
  isVerified: false,
  isWaitlist: true,
  termsAccepted: true,
  username: "dave@semasoftware.com",
  password: null,
  firstName: "Dave",
  lastName: "Mustaine",
  jobTitle: "Engineer",
  avatarUrl: "https://avatars.githubusercontent.com/u/82075558?v=4",
  identities: [
    {
      provider: "github",
      id: "82075558",
      username: "davemustaine",
      email: "dave@semasoftware.com",
      firstName: "Matt",
      lastName: "Mustaine",
      profileUrl: "https://api.github.com/users/davemustaine",
      avatarUrl: "https://avatars.githubusercontent.com/u/82075558?v=4"
    }
  ],
  verificationToken: null,
  verificationExpires: null,
  termsAcceptedAt: "2020-05-12T13:53:10.734Z",
  organizations: [
    {
      isActive: true,
      isAdmin: true,
      id: "82075564",
      orgName: "Sema"
    }
  ],
  _id: "6076262a407c64f11499537a"
};

/* "SEMA_GITHUB_REGEX" is closely tied to "getSemaGithubText". This regex is used to edit any existing sema comment.
 * Don't forget to change both "SEMA_GITHUB_REGEX" & "getSemaGithubText" when you change anyone
 */
export const SEMA_GITHUB_REGEX = /\*\*Sema Reaction:\*\*([ \w : |])*\*\*Sema Tags:\*\*([ \w : | ,])*/s;
export const SEMA_REACTION_REGEX = /\*\*Sema Reaction:\*\*([ \w : |])*/s;
export const SEMA_TAGS_REGEX = /\*\*Sema Tags:\*\*([ \w : | ,])*/s;

export const SEMA_ICON_ANCHOR =
  "<span class='tooltipped tooltipped-nw' style='position: absolute; right: 35px' aria-label='Sema Smart Comments enabled'>" +
  "<a href='https://semasoftware.com/' target='_blank' aria-label='Learn about Sema smart comments'>" +
  "<svg width='16' height='17' viewBox='0 0 16 17' fill='none' xmlns='http://www.w3.org/2000/svg'>" +
  "<path fill-rule='evenodd' clip-rule='evenodd' d='M14.85 3.5H1.15C0.52 3.5 0 4.02 0 4.65V12.34C0 12.98 0.52 13.5 1.15 13.5H14.84C15.48 13.5 15.99 12.98 15.99 12.35V4.65C16 4.02 15.48 3.5 14.85 3.5V3.5Z' fill='#586069'/>" +
  "<path fill-rule='evenodd' clip-rule='evenodd' d='M4.22998 12.7135H5.49039L7.76044 4.28662H6.50003L4.22998 12.7135ZM10.3967 8.68154L10.7696 8.02495L9.80282 7.55312L10.7696 7.08129L10.3967 6.42469L9.49597 7.0285L9.56856 5.95286H8.81957L8.88886 7.0285L7.9881 6.42469L7.61526 7.08129L8.58531 7.55312L7.61526 8.02495L7.9881 8.68154L8.88886 8.07774L8.81957 9.15337H9.56856L9.49597 8.07774L10.3967 8.68154Z' fill='white'/>" +
  '</svg>' +
  '</a>' +
  '</span>';

export const SEMABAR_CLASS = 'sema';
export const SEMA_SEARCH_CLASS = 'sema-search';

//TODO: this will need to change. modal is not global
export const GLOBAL_SEMA_SEARCH_ID = 'globalSemaSearch';
export const ON_INPUT_DEBOUCE_INTERVAL_MS = 250;
export const CALCULATION_ANIMATION_DURATION_MS = 1000;

export const SUGGESTED_TAG_LIMIT = 3;
