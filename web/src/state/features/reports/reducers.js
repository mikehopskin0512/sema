import * as types from './types';

const initialState = {
  isFetching: false,
  modeUrl: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_MODE_URL:
    return {
      ...state,
      isFetching: true,
    };
  case types.RECIEVE_MODE_URL:
    return {
      ...state,
      isFetching: false,
      token: action.token,
      error: {},
    };
  case types.REQUEST_MODE_URL_ERROR:
    return {
      ...state,
      isFetching: false,
      token: {},
      error: action.error,
    };
  default:
    return state;
  }
};

export default reducer;
