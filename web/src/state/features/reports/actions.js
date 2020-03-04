import * as types from './types';

import { getAll } from '../../utils/api';

const requestModeUrl = () => ({
  type: types.REQUEST_MODE_URL,
});

const receiveModeUrl = (data) => ({
  type: types.RECEIVE_MODE_URL,
  reportUrl: data.requestUri,
});

const requestModeUrlError = (errors) => ({
  type: types.REQUEST_MODE_URL_ERROR,
  errors,
});

export const getModeUrl = (token) => async (dispatch) => {
  dispatch(requestModeUrl());
  const res = await getAll('/v1/embedded_bi', {}, token);
  if (res.error) {
    dispatch(requestModeUrlError(res.error));
  }
  if (res.data && res.data.token) {
    dispatch(receiveModeUrl(res.data));
  }
};

export const somethingElse = '';
