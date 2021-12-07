// eslint-disable-next-line import/prefer-default-export
import {
  blue100,
  gray800,
  blue300,
  blue500,
  blue800,
} from '../../styles/_colors.module.scss';

export const EMOJIS = [
  {
    _id: '607f0d1ed7f45b000ec2ed70',
    title: 'No reaction',
    label: 'No reaction',
    emoji: '⚪',
    github_emoji: ':white_circle:',
    color: blue100,
  },
  {
    _id: '607f0d1ed7f45b000ec2ed71',
    title: 'This code is <b>awesome</b>',
    label: 'Awesome',
    emoji: '🏆',
    github_emoji: ':trophy:',
    color: gray800,
  },
  {
    _id: '607f0d1ed7f45b000ec2ed72',
    title: 'This code <b>looks good</b>',
    label: 'Looks good',
    emoji: '👌',
    github_emoji: ':ok_hand:',
    color: blue300,
  },
  {
    _id: '607f0d1ed7f45b000ec2ed73',
    title: 'I have a <b>question</b>',
    label: 'Question',
    emoji: '❓',
    github_emoji: ':question:',
    color: blue500,
  },
  {
    _id: '607f0d1ed7f45b000ec2ed74',
    title: 'This code <b>needs a fix</b>',
    label: 'Needs a fix',
    emoji: '🛠',
    github_emoji: ':hammer_and_wrench:',
    color: blue800,
  },
];
export const TAGS = [
  {
    label: 'Readable',
    _id: '607f0594ab1bc1aecbe2ce4b',
    isPositive: true,
  },
  {
    label: 'Unreadable',
    _id: '607f0594ab1bc1aecbe2ce4c',
  },
  {
    label: 'Secure',
    _id: '607f0594ab1bc1aecbe2ce4d',
    isPositive: true,
  },
  {
    label: 'Not secure',
    _id: '607f0594ab1bc1aecbe2ce4e',
  },
  {
    label: 'Efficient',
    _id: '607f0594ab1bc1aecbe2ce4f',
    isPositive: true,
  },
  {
    label: 'Inefficient',
    _id: '607f0594ab1bc1aecbe2ce50',
  },
  {
    label: 'Elegant',
    _id: '607f0594ab1bc1aecbe2ce51',
    isPositive: true,
  },
  {
    label: 'Inelegant',
    _id: '607f0594ab1bc1aecbe2ce52',
  },
  {
    label: 'Reusable',
    _id: '607f0594ab1bc1aecbe2ce53',
    isPositive: true,
  },
  {
    label: 'Not reusable',
    _id: '607f0594ab1bc1aecbe2ce54',
  },
  {
    label: 'Fault-tolerant',
    _id: '607f0594ab1bc1aecbe2ce55',
    isPositive: true,
  },
  {
    label: 'Brittle',
    _id: '607f0594ab1bc1aecbe2ce56',
  },
  {
    label: 'Maintainable',
    _id: '607f0594ab1bc1aecbe2ce57',
    isPositive: true,
  },
  {
    label: 'Not maintainable',
    _id: '607f0594ab1bc1aecbe2ce58',
  },
];

export const CIRCULAR_PACKING_COLORS = {
  POSITIVE: '#9FE1F5',
  NEGATIVE: '#E8E8E8'
}

export const DAYS_IN_WEEK = 7;
export const DAYS_IN_MONTH = 30;
export const DAYS_IN_YEAR = 365;

export const DEFAULT_AVATAR = '/img/default-avatar.jpg';

export const GITHUB_URL = 'https://github.com';

export const DEFAULT_COLLECTION_NAME = "my snippets";

export const SEMA_FAQ_URL = 'https://semasoftware.com/faq';

export const noContactUs = ['/login', '/register/[[...param]]'];

export const SEARCH_CATEGORY_TITLES = {
  COLLECTIONS: 'snippets collections',
  SNIPPETS: 'snippets',
};

export const FACEBOOK_VERIFICATION_META = {
  CONTENT: 'ifssvqgtnpjyeaear8sksn3oez0aqk',
  NAME: 'facebook-domain-verification',
};

export const PATHS = {
  DASHBOARD: '/dashboard',
  PERSONAL_INSIGHTS: '/personal-insights',
  SNIPPETS: {
    _: '/snippets',
    EDIT: '/snippets/edit',
    ADD: '/snippets/add',
  },
  INVITATIONS: '/invitations',
  PROFILE: '/profile',
  OVERVIEW: '/overview',
  REPO: '/repo',
  SUPPORT: '/support',
  GUIDES: '/guides',
  LOGIN: '/login',
  TEAM: '/team',
  ONBOARDING: '/onboarding',
  REGISTER: '/register',
  PASSWORD_RESET: '/password-reset',
  TEAMS: '/teams',
  REPORTS: '/reports',
};

export const SEMA_TEAM_ADMIN_NAME = 'Sema Super Team';

export const SUPPORT_VIDEO_LANGUAGES = [
  {
    value: 'english',
    label: 'English',
    url: 'https://www.youtube.com/embed/x6FoswLcqxE'
  },
  {
    value: 'russian',
    label: 'Russian',
    url: 'https://www.youtube.com/embed/Q7ryQIm2eYY'
  },
]