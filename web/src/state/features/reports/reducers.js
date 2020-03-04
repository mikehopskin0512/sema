import * as types from './types';

const initialState = {
  isFetching: false,
  reportUrl: '',
  pdfUrl: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_MODE_URL:
    return {
      ...state,
      isFetching: true,
    };
  case types.RECEIVE_MODE_URL:
    return {
      ...state,
      isFetching: false,
      reportUrl: action.reportUrl,
      pdfUrl: action.pdfUrl,
      error: {},
    };
  case types.REQUEST_MODE_URL_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.error,
    };
  default:
    return state;
  }
};

export default reducer;
