import * as types from './types';

import { get } from '../../utils/api';

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

export const getModeUrl = () => async (dispatch) => {
  const params = '';
  dispatch(requestModeUrl());
  const res = await get('/embedded_bi', params);
  if (res.error) {
    dispatch(requestModeUrlError(res.error));
  }
  if (res.data && res.data.token) {
    dispatch(recieveModeUrl(res.data));
  }
};

export const somethingElse = '';
