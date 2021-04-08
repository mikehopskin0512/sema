export const SUGGESTION_URL = 'https://api-qa1.semasoftware.io/v1/comments/?q=';
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

export const EMOJIS = [
  {
    title: 'No reaction',
    emoji: '⚪',
    github_emoji: ':white_circle:',
  },
  {
    title: 'Awesome',
    emoji: '🏆',
    github_emoji: ':trophy:',
  },
  {
    title: 'Looks good',
    emoji: '👌',
    github_emoji: ':ok_hand:',
  },
  {
    title: 'I have a question',
    emoji: '❓',
    github_emoji: ':question:',
  },
  {
    title: 'Fix',
    emoji: '🛠',
    github_emoji: ':hammer_and_wrench:',
  },
];

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
