import { GLOBAL_SEMA_SEARCH_ID } from '../../constants';

const initialState = {
  github: {
    isTyping: false,
  },
  semabars: {},
  semasearches: {},
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
