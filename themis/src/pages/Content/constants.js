export const SUGGESTION_URL = 'https://api-qa1.semasoftware.io/v1/comments/?q=';
export const ADD_OP = 'add';
export const DELETE_OP = 'delete';
export const TOGGLE_OP = 'toggle';
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
    [NEGATIVE]: 'Unsecure',
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
