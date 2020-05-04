import * as types from './types';

const initialState = {
  isFetching: false,
  reportId: '',
  reportUrl: '',
  reportToken: '',
  runToken: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_REPORT_URL:
    return {
      ...state,
      isFetching: true,
    };
  case types.RECEIVE_REPORT_URL:
    return {
      ...state,
      isFetching: false,
      reportId: action.reportId,
      reportUrl: action.reportUrl,
      error: {},
    };
  case types.RECEIVE_REPORT_RUN_TOKEN:
    return {
      ...state,
      isFetching: false,
      runToken: action.runToken,
      reportTitle: action.reportTitle,
      error: {},
    };
  case types.REQUEST_REPORT_URL_ERROR:
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
