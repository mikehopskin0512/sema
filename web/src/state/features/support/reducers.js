import * as types from './types';

const initialState = {
  isSending: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.SEND_SUPPORT:
    return {
      ...state,
      isSending: true,
      error: {},
    };
  case types.SEND_SUPPORT_SUCCESS:
    return {
      ...state,
      isSending: false,
      error: {},
    };
  case types.SEND_SUPPORT_ERROR:
    return {
      ...state,
      isSending: false,
      errors: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
