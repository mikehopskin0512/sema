/* eslint-disable import/no-cycle */

import { getNotificationsToken } from './api';
import * as types from './types';

const fetchNotificationsTokenRequest = () => ({
  type: types.REQUEST_NOTIFICATIONS_TOKEN
});

const fetchNotificationTokensSuccess = token => ({
  type: types.REQUEST_NOTIFICATIONS_TOKEN_SUCCESS,
  token
});

const fetchNotificationsTokenError = errors => ({
  type: types.REQUEST_NOTIFICATIONS_TOKEN_ERROR,
  errors
});

export const fetchNotificationsToken = token => async dispatch => {
  try {
    dispatch(fetchNotificationsTokenRequest());
    const payload = await getNotificationsToken(token);
    if (!payload) {
      return false;
    }
    const {
      data: { notificationsToken }
    } = payload;
    dispatch(fetchNotificationTokensSuccess(notificationsToken));
    return notificationsToken;
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText
      }
    } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(fetchNotificationsTokenError(errMessage));
  }
};
