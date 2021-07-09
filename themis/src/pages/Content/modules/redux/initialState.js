import { GLOBAL_SEMA_SEARCH_ID } from '../../constants';

const initialState = {
  githubMetadata: {
    url: null,
    repo: null,
    pull_number: null,
    head: null,
    base: null,
    user: { id: null, login: null },
    requester: null,
    commentId: null,
    filename: null,
    file_extension: null,
    line_numbers: [],
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
};

export default initialState;
