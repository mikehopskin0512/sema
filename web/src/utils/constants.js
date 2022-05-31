// eslint-disable-next-line import/prefer-default-export
import {
  blue100,
  gray800,
  blue300,
  blue500,
  blue800
} from '../../styles/_colors.module.scss';

export const EMOJIS = [
  {
    _id: '607f0d1ed7f45b000ec2ed70',
    title: 'No reaction',
    label: 'No reaction',
    emoji: '⚪',
    github_emoji: ':white_circle:',
    color: blue100
  },
  {
    _id: '607f0d1ed7f45b000ec2ed71',
    title: 'This code is <b>awesome</b>',
    label: 'Awesome',
    emoji: '🏆',
    github_emoji: ':trophy:',
    color: gray800
  },
  {
    _id: '607f0d1ed7f45b000ec2ed72',
    title: 'This code <b>looks good</b>',
    label: 'Looks good',
    emoji: '👌',
    github_emoji: ':ok_hand:',
    color: blue300
  },
  {
    _id: '607f0d1ed7f45b000ec2ed73',
    title: 'I have a <b>question</b>',
    label: 'Question',
    emoji: '❓',
    github_emoji: ':question:',
    color: blue500
  },
  {
    _id: '607f0d1ed7f45b000ec2ed74',
    title: 'This code <b>needs a fix</b>',
    label: 'Needs a fix',
    emoji: '🛠',
    github_emoji: ':hammer_and_wrench:',
    color: blue800
  }
];
export const TAGS = [
  {
    label: 'Readable',
    _id: '607f0594ab1bc1aecbe2ce4b',
    isPositive: true
  },
  {
    label: 'Unreadable',
    _id: '607f0594ab1bc1aecbe2ce4c'
  },
  {
    label: 'Secure',
    _id: '607f0594ab1bc1aecbe2ce4d',
    isPositive: true
  },
  {
    label: 'Not secure',
    _id: '607f0594ab1bc1aecbe2ce4e'
  },
  {
    label: 'Efficient',
    _id: '607f0594ab1bc1aecbe2ce4f',
    isPositive: true
  },
  {
    label: 'Inefficient',
    _id: '607f0594ab1bc1aecbe2ce50'
  },
  {
    label: 'Elegant',
    _id: '607f0594ab1bc1aecbe2ce51',
    isPositive: true
  },
  {
    label: 'Inelegant',
    _id: '607f0594ab1bc1aecbe2ce52'
  },
  {
    label: 'Reusable',
    _id: '607f0594ab1bc1aecbe2ce53',
    isPositive: true
  },
  {
    label: 'Not reusable',
    _id: '607f0594ab1bc1aecbe2ce54'
  },
  {
    label: 'Fault-tolerant',
    _id: '607f0594ab1bc1aecbe2ce55',
    isPositive: true
  },
  {
    label: 'Brittle',
    _id: '607f0594ab1bc1aecbe2ce56'
  },
  {
    label: 'Maintainable',
    _id: '607f0594ab1bc1aecbe2ce57',
    isPositive: true
  },
  {
    label: 'Not maintainable',
    _id: '607f0594ab1bc1aecbe2ce58'
  }
];

export const CIRCULAR_PACKING_COLORS = {
  POSITIVE: '#9FE1F5',
  NEGATIVE: '#E8E8E8'
};

export const COLLECTION_TYPE = {
  COMMUNITY: 'community',
  PERSONAL: 'personal',
  TEAM: 'team'
};

export const DAYS_IN_WEEK = 7;
export const DAYS_IN_MONTH = 30;
export const DAYS_IN_YEAR = 365;

export const DEFAULT_AVATAR = '/img/default-avatar.jpg';

export const GITHUB_URL = 'https://github.com';

export const DEFAULT_COLLECTION_NAME = 'my snippets';

export const SEMA_CORPORATE_ORGANIZATION_NAME = 'Sema Corporate Team';

export const SEMA_CORPORATE_ORGANIZATION_ID = '614f2fe7811ae802fc08e36e';

export const SEMA_FAQ_URL = 'https://semasoftware.com/content/faqs';
export const SEMA_INTERCOM_FAQ_URL = 'https://intercom.help/sema-software/en';

export const SEMA_APP_URL = 'https://app.semasoftware.com';

export const SEMA_INTERCOM_URL = 'https://intercom.help/sema-software/en/';

export const SEMA_FAQ_SLUGS = {
  LEARN_MORE_ABOUT_ORGANIZATION_INSIGHTS:
    'articles/6116499-team-insights-who-can-see-what',
  LEARN_MORE_ABOUT_PERSONAL_INSIGHTS:
    'articles/6116505-is-there-an-executive-dashboard-of-all-developers',
  LEARN_MORE_ABOUT_SNIPPETS:
    'articles/6147206-what-are-snippets',
  LEARN_MORE: 'is-there-a-manager-dashboard-of-all-developers',
  SUMMARIES: 'what-do-summaries-mean',
  TEAM_INSIGHTS: 'team-insights-who-can-see-what',
  MARKDOWN: 'whats-markdown-and-how-do-i-use-it',
  SNIPPETS: 'what-are-snippets',
  SNAPSHOTS: 'what-are-snapshots'
};

export const noContactUs = ['/login', '/register/[[...param]]', '/support'];

export const SEARCH_CATEGORY_TITLES = {
  COLLECTIONS: 'snippets collections',
  SNIPPETS: 'snippets'
};

export const FACEBOOK_VERIFICATION_META = {
  CONTENT: 'ifssvqgtnpjyeaear8sksn3oez0aqk',
  NAME: 'facebook-domain-verification'
};

export const PATHS = {
  PERSONAL: '/personal',
  DASHBOARD: '/dashboard',
  PERSONAL_INSIGHTS: '/personal-insights',
  LABELS_MANAGEMENT: '/labels-management',
  SNIPPETS: {
    _: '/snippets',
    EDIT: '/snippets/edit',
    ADD: '/snippets/add'
  },
  INVITATIONS: '/invitations',
  PROFILE: '/profile',
  OVERVIEW: '/overview',
  REPO: '/repo',
  REPOS: '/repos',
  SUPPORT: '/support',
  GUIDES: '/guides',
  LOGIN: '/login',
  ORGANIZATIONS: {
    _: '/organizations',
    EDIT: id => `/teams/${id}/edit`,
    ADD: '/organizations/add',
    INVITE: id => `/organizations/${id}/invite`,
    SETTINGS: id => `/organizations/${id}/settings`,
    LABELS: id => `/organizations/${id}/settings?tab=labels`,
    MANAGEMENT: id => `/organizations/${id}/settings?tab=management`
  },
  ONBOARDING: '/onboarding',
  REGISTER: '/register',
  PASSWORD_RESET: '/password-reset',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  ORGANIZATION_CREATE: '/organizations/add',
  ORGANIZATION_INVITE: '/organizations/invite',
  SEMA_ADMIN: '/sema-admin',
  PORTFOLIO: {
    _: '/portfolios',
    VIEW: (handle, id) => `/${handle}/portfolio/${id}`,
    PORTFOLIOS: '/portfolios?tab=portfolios',
    SNAPSHOTS: '/portfolios?tab=snapshots'
  },
  IDENTITIES: '/api/identities/github',
  ORGANIZATION_INSIGHTS: '/team-insights'
};

export const SUPPORT_VIDEO_LANGUAGES = [
  {
    value: 'english',
    label: 'English',
    url: 'https://www.youtube.com/embed/4AnOJ5sr_hY'
  }
];

export const TEAM_MENU_HEADERS = [
  {
    name: 'Team Management',
    path: `${PATHS.ORGANIZATIONS._}/[teamId]/edit`
  }
];

export const PROFILE_VIEW_MODE = {
  INDIVIDUAL_VIEW: 'individual_view',
  ORGANIZATION_VIEW: 'team_view'
};

export const SEMA_COLLECTIONS_VIEW_MODE = 'sema_collections_view_mode';
export const NUM_PER_PAGE = 10;

export const SEMA_ROLES = {
  admin: 'Admin',
  libraryEditor: 'Library Editor',
  member: 'Member'
};

// TODO: should be in place, no need to put to constants
export const TAB = {
  info: 'info',
  management: 'management',
  labels: 'labels'
};

export const TAG_TYPE = {
  LANGUAGE: 'language',
  GUIDE: 'guide',
  CUSTOM: 'custom'
};

export const BAR_CHART_MIN_TOP = 132;
export const CIRCLE_CHART_MIN_TOP = 275;
export const ON_INPUT_DEBOUNCE_INTERVAL_MS = 250;

export const RESPONSE_STATUSES = {
  SUCCESS: 200,
  CREATED: 201
};

export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error'
};

export const PORTFOLIO_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
};

export const KEY_CODES = {
  ENTER: 13
};

export const COLLECTION_TYPES = {
  PERSONAL: 'personal',
  ORGANIZATION: 'organization',
  COMMUNITY: 'community'
};

export const KNOWLEDGE_BASE = [
  {
    description: 'How do I use Tags in the Chrome Extension?',
    link:
      'https://intercom.help/sema-software/en/articles/6147189-how-do-i-use-tags-in-the-chrome-extension'
  },
  {
    description: 'What are Snippets?',
    link:
      'https://intercom.help/sema-software/en/articles/6147206-what-are-snippets'
  },
  {
    description: 'How do I set up a team?',
    link:
      'https://intercom.help/sema-software/en/articles/6147266-how-do-i-set-up-a-team'
  },
  {
    description: 'What’s a Developer Portfolio?',
    link:
      'https://intercom.help/sema-software/en/articles/6147276-what-s-a-developer-portfolio'
  },
  {
    description: 'How do I use Snippets in the Chrome Extension?',
    link:
      'https://intercom.help/sema-software/en/articles/6147192-how-do-i-use-snippets-in-the-chrome-extension'
  },
  {
    description: 'How do I add Snippets?',
    link:
      'https://intercom.help/sema-software/en/articles/6147257-how-do-i-add-snippets'
  },
  {
    description: 'How do I invite someone to a team?',
    link:
      'https://intercom.help/sema-software/en/articles/6147271-how-do-i-invite-someone-to-a-team'
  },
  {
    description: 'What’s a Snapshot?',
    link:
      'https://intercom.help/sema-software/en/articles/6147279-what-s-a-snapshot'
  },
  {
    description: 'How do I use Summaries in the Chrome Extension?',
    link:
      'https://intercom.help/sema-software/en/articles/6147171-how-do-i-use-summaries-in-the-chrome-extension'
  },
  {
    description: 'You are missing some best practices',
    link:
      'https://intercom.help/sema-software/en/articles/6147264-you-are-missing-some-best-practices'
  },
  {
    description: 'Team Insights - who can see what?',
    link:
      'https://intercom.help/sema-software/en/articles/6116499-team-insights-who-can-see-what'
  },
  {
    description: 'What are good practices to create Snapshots?',
    link:
      'https://intercom.help/sema-software/en/articles/6147283-what-are-good-practices-to-create-snapshots'
  }
];

export const KNOWLEDGE_BASE_TITLES = [
  {
    title: 'Chrome Extension'
  },
  {
    title: 'Snippets (Coding Best Practices)'
  },
  {
    title: 'Teams'
  },
  {
    title: 'Developer Portfolio and Snapshots'
  }
];

export const KNOWLEDGE_BASE_SUMMARIES_URL =
  'https://intercom.help/sema-software/en/articles/6147171-how-do-i-use-summaries-in-the-chrome-extension';

export const KNOWLEDGE_BASE_TAGS_URL =
  'https://intercom.help/sema-software/en/articles/6147189-how-do-i-use-tags-in-the-chrome-extension';

export const SORTING_TYPES = {
  ALPHABETICAL_SORT: 'alphabetical',
  DEFAULT_COMPARE_SORT: 'default_compare_sort'
};

export const DROPDOWN_SORTING_TYPES = {
  ...SORTING_TYPES,
  NO_SORT: 'no_sort',
  ALPHABETICAL_USER_PRIORIY_SORT: 'alphabetical_user_priority',
  CHRONOLOGICAL_SORT: 'chronological_sort'
};
