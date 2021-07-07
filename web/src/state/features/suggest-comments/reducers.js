import * as types from './types';

const initialState = {
  suggestedComments: [],
  totalCount: 0,
  isFetching: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_FETCH_SUGGEST_COMMENTS:
      return {
        ...state,
        isFetching: true,
      };
    case types.REQUEST_FETCH_SUGGEST_COMMENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        suggestedComments: action.suggestedComments,
        totalCount: action.totalCount,
        error: {},
      };
    case types.REQUEST_FETCH_SUGGEST_COMMENTS_ERROR:
      return {
        ...state,
        isFetching: false,
        suggestedComments: [],
        error: action.errors,
      };
    default:
      return state;
  }
};

export default reducer;
