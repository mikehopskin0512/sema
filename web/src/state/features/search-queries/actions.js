import { getSearchQueries, exportSearchQueries } from './api';
import * as types from './types';
import { format } from "date-fns";

const requestFetchSearchQueries = () => ({
  type: types.REQUEST_FETCH_SEARCH_QUERIES,
});

const requestFetchSearchQueriesSuccess = (queries, totalCount) => ({
  type: types.REQUEST_FETCH_SEARCH_QUERIES_SUCCESS,
  queries,
  totalCount
});

const requestFetchSearchQueriesError = (errors) => ({
  type: types.REQUEST_FETCH_SEARCH_QUERIES_ERROR,
  errors,
});

export const fetchSearchQueries = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestFetchSearchQueries());
    const payload = await getSearchQueries(params, token);
    const { data: { queries = [], totalCount } } = payload;

    dispatch(requestFetchSearchQueriesSuccess(queries, totalCount));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchSearchQueriesError(errMessage));
  }
};

export const exportSearchTerms = async (params = {}, token)  => {
  try {
    const payload = await exportSearchQueries(params, token);

    const { data } = payload;

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `metric_${format(new Date(), 'yyyyMMdd')}.csv`);

    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(error);
  }
};
