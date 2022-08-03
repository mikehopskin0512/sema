import { GLOBAL_SEMA_SEARCH_ID, SEMA_REMINDER_SESSION_STORAGE_KEY } from '../../constants';

const initialState = {
  notifications: [],
  organizations: [],
  selectedProfile: { name: 'Personal' },
  isReminderClosed: !!sessionStorage.getItem(SEMA_REMINDER_SESSION_STORAGE_KEY),
  githubMetadata: {
    url: null,
    repo: null,
    pull_number: null,
    head: null,
    base: null,
    user: { id: null, login: null },
    requester: null,
    requesterAvatarUrl: null,
    commentId: null,
    filename: null,
    file_extension: null,
    line_numbers: [],
    title: null,
    clone_url: null,
  },
  github: {
    isTyping: false,
  },
  user: {
    isLoggedIn: false,
  },
  semabars: {},
  semasearches: {},
  observer: null,
  smartComment: {},
  [GLOBAL_SEMA_SEARCH_ID]: {
    data: '',
    isOpen: false,
    openFor: '',
    isLoading: false,
    position: {
      top: null,
      left: null,
    },
  },
  lastUserSmartComment: null,
  snippetSaved: {
    isSaved: false,
    semabarContainerId: null,
  },
};

export default initialState;
