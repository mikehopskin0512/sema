import * as types from './types';

const initialState = {
  isFetching: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_NOTIFICATIONS_TOKEN_SUCCESS:
      return {
        ...state,
        notificationsToken: action.token,
        isFetching: false
      };
    case types.REQUEST_NOTIFICATIONS_TOKEN_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.errors
      };
    case types.REQUEST_NOTIFICATIONS_TOKEN:
      return {
        ...state,
        isFetching: true,
        error: null
      };

    default:
      return state;
  }
};

export default reducer;
