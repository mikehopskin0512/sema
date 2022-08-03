import * as types from './types';

const initialState = {
  isLoading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.CONNECT_ORG:
    return {
      ...state,
      isLoading: true,
    };
  case types.CONNECT_ORG_SUCCESS:
    return {
      ...state,
      isLoading: false,
    };
  case types.CONNECT_ORG_ERROR:
    return {
      ...state,
      isLoading: false,
      error: action.errors,
    };
  default:
    return state;
  }
};

export default reducer;
