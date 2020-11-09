import * as types from './types';
import { getSources, postSource } from './api';
import { alertOperations } from '../alerts';

const { triggerAlert, clearAlert } = alertOperations;

const requestCreateSource = () => ({
  type: types.REQUEST_CREATE_SOURCE,
});

const requestCreateSourceSuccess = (source) => ({
  type: types.REQUEST_CREATE_SOURCE_SUCCESS,
  source,
});

const requestCreateSourceError = (errors) => ({
  type: types.REQUEST_CREATE_SOURCE_ERROR,
  errors,
});

const requestFetchSources = () => ({
  type: types.REQUEST_FETCH_SOURCES,
});

const requestFetchSourcesSuccess = (sources) => ({
  type: types.REQUEST_FETCH_SOURCES_SUCCESS,
  sources,
});

const requestFetchSourcesError = (errors) => ({
  type: types.REQUEST_FETCH_SOURCES_ERROR,
  errors,
});

export const createSource = (sourceData, token) => async (dispatch) => {
  try {
    dispatch(requestCreateSource());
    const payload = await postSource({ source: sourceData }, token);
    const { data: { source = {} } } = payload;

    dispatch(triggerAlert('Source has been added', 'success'));
    dispatch(requestCreateSourceSuccess(source));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestCreateSourceError(errMessage));
  }
};

export const fetchSources = (orgId, token) => async (dispatch) => {
  try {
    dispatch(requestFetchSources());
    const payload = await getSources({ orgId }, token);
    const { data: { sources = [] } } = payload;

    dispatch(requestFetchSourcesSuccess(sources));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchSourcesError(errMessage));
  }
};
