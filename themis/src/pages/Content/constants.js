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

export const SEMA_ICON_ANCHOR =
  "<span class='tooltipped tooltipped-nw' style='position: absolute; right: 35px' aria-label='Sema Smart Comments enabled'> " +
  "<a href='https://semasoftware.com/' target='_blank' aria-label='Learn about Sema smart comments'>" +
  "<svg width='16' height='11' viewBox='0 0 16 11' fill='none' xmlns='http://www.w3.org/2000/svg'><rect width='16' height='11' rx='2' fill='#586069'/>" +
  "<path d='M7.898 9.081C7.418 9.081 6.944 9.018 6.476 8.892C6.008 8.766 5.627 8.595 5.333 8.379L5.864 7.182C6.176 7.38 6.506 7.533 6.854 7.641C7.208 7.743 7.562 7.794 7.916 7.794C8.276 7.794 8.552 7.746 8.744 7.65C8.936 7.548 9.032 7.407 9.032 7.227C9.032 7.065 8.945 6.933 8.771 6.831C8.597 6.723 8.27 6.618 7.79 6.516C7.184 6.396 6.713 6.249 6.377 6.075C6.041 5.895 5.804 5.685 5.666 5.445C5.534 5.205 5.468 4.914 5.468 4.572C5.468 4.182 5.579 3.831 5.801 3.519C6.023 3.201 6.335 2.955 6.737 2.781C7.139 2.601 7.598 2.511 8.114 2.511C8.576 2.511 9.023 2.577 9.455 2.709C9.893 2.835 10.235 3.003 10.481 3.213L9.959 4.41C9.677 4.212 9.38 4.062 9.068 3.96C8.756 3.852 8.444 3.798 8.132 3.798C7.826 3.798 7.58 3.858 7.394 3.978C7.208 4.092 7.115 4.248 7.115 4.446C7.115 4.554 7.148 4.644 7.214 4.716C7.28 4.788 7.403 4.86 7.583 4.932C7.763 4.998 8.033 5.07 8.393 5.148C8.975 5.274 9.431 5.427 9.761 5.607C10.097 5.781 10.334 5.988 10.472 6.228C10.61 6.462 10.679 6.744 10.679 7.074C10.679 7.698 10.436 8.19 9.95 8.55C9.464 8.904 8.78 9.081 7.898 9.081Z' fill='white'/>" +
  '</svg>' +
  '</a>' +
  '</span>';
