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
    title: 'None',
    image: 'sema_none',
    emoji: '⚪',
  },
  {
    title: 'Awesome',
    image: 'sema_trophy',
    emoji: '🏆',
  },
  {
    title: 'Looks good',
    image: 'sema_ok',
    emoji: '👌',
  },
  {
    title: 'I have a question',
    image: 'sema_question',
    emoji: '❓',
  },
  {
    title: 'Fix',
    image: 'sema_tools',
    emoji: '🛠',
  },
];
