/* eslint-disable import/prefer-default-export */
import { sendSupport } from './api';
import * as types from './types';
import { alertOperations } from '../alerts';

const { triggerAlert } = alertOperations;

const sendSupportEmail = () => ({
  type: types.SEND_SUPPORT,
});

const sendSupportEmailSuccess = () => ({
  type: types.SEND_SUPPORT_SUCCESS,
});

const sendSupportEmailError = (errors) => ({
  type: types.SEND_SUPPORT_ERROR,
  errors,
});

export const submitSupportEmail = (params, token) => async (dispatch) => {
  try {
    dispatch(sendSupportEmail());
    const response = await sendSupport(params, token);
    dispatch(sendSupportEmailSuccess());
    dispatch(triggerAlert('Your feedback is sent!', 'success'));
    return response;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(sendSupportEmailError(errMessage));
    dispatch(triggerAlert(message, 'error'));
    return error.response;
  }
};
