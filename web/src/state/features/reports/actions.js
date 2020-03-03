import * as types from './types';

import { getAll } from '../../utils/api';

const requestModeUrl = () => ({
  type: types.REQUEST_MODE_URL,
});

const recieveModeUrl = (data) => ({
  type: types.RECIEVE_MODE_URL,
  token: data.token,
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
    dispatch(recieveModeUrl(res.data));
  }
};

export const somethingElse = '';
