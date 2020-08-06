import Router from 'next/router';
import * as types from './types';
import { initiatePasswordReset, validatePasswordReset, resetPassword } from './api';

import { alertOperations } from '../alerts';

const { triggerAlert } = alertOperations;

const requestPasswordResetRequest = () => ({
  type: types.REQUEST_PASSWORD_RESET,
});

const passwordResetRequestSucess = () => ({
  type: types.REQUEST_PASSWORD_RESET_SUCCESS,
});

const passwordResetRequestError = (errors) => ({
  type: types.REQUEST_PASSWORD_RESET_ERROR,
  errors,
});

const requestVerifyResetToken = () => ({
  type: types.REQUEST_VERIFY_RESET_TOKEN,
});

const verifyResetTokenSucess = () => ({
  type: types.VERIFY_RESET_TOKEN_SUCCESS,
});

const verifyResetTokenError = (errors) => ({
  type: types.VERIFY_RESET_TOKEN_ERROR,
  errors,
});

const requestPasswordReset = () => ({
  type: types.RESET_PASSWORD,
});

const passwordResetSucess = () => ({
  type: types.PASSWORD_RESET_SUCCESS,
});

const passwordResetError = (errors) => ({
  type: types.PASSWORD_RESET_ERROR,
  errors,
});

export const passwordResetRequest = (email) => async (dispatch) => {
  try {
    dispatch(requestPasswordResetRequest());
    await initiatePasswordReset({ username: email });

    dispatch(passwordResetRequestSucess());
  } catch (error) {
    dispatch(passwordResetRequestError(error.response.data));
  }
};

export const verifyResetToken = (userId, resetToken) => async (dispatch) => {
  try {
    dispatch(requestVerifyResetToken());
    await validatePasswordReset({}, userId, resetToken);

    dispatch(verifyResetTokenSucess());
  } catch (error) {
    dispatch(verifyResetTokenError(error.response.data));
    Router.push('/password-reset?err=1');
  }
};

export const changePassword = (password, token) => async (dispatch) => {
  try {
    dispatch(requestPasswordReset());
    await resetPassword({ token, password });

    dispatch(passwordResetSucess());
  } catch (error) {
    dispatch(passwordResetError(error.response.data));
  }
};
