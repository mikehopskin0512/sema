/* eslint-disable import/no-cycle */
import {
  bulkAdmit,
  getTimeToValueMetric,
  getUsers,
  updateUserInvitations,
  updateUserStatus,
  exportTimeToValue,
  exportUsersApi,
} from './api';
import * as types from './types';
import { format } from 'date-fns';

const requestUpdateUserAvailableInvitations = () => ({
  type: types.REQUEST_UPDATE_USER_AVAILABLE_INVITATIONS,
});

const requestUpdateUserAvailableInvitationsSuccess = (user) => ({
  type: types.REQUEST_UPDATE_USER_AVAILABLE_INVITATIONS_SUCCESS,
  user,
});

const requestUpdateUserAvailableInvitationsError = (errors) => ({
  type: types.REQUEST_UPDATE_USER_AVAILABLE_INVITATIONS_ERROR,
  errors,
});

const requestFetchUsers = () => ({
  type: types.REQUEST_FETCH_USERS,
});

const requestFetchUsersSuccess = (users, totalCount, filters) => ({
  type: types.REQUEST_FETCH_USERS_SUCCESS,
  users,
  totalCount,
  filters,
});

const requestFetchUsersError = (errors) => ({
  type: types.REQUEST_FETCH_USERS_ERROR,
  errors,
});

const requestUpdateUserStatus = () => ({
  type: types.UPDATE_USER_STATUS,
});

const requestUpdateUserStatusSuccess = (users) => ({
  type: types.UPDATE_USER_STATUS_SUCCESS,
  users,
});

const requestUpdateUserStatusError = (errors) => ({
  type: types.UPDATE_USER_STATUS_ERROR,
  errors,
});

const requestBulkAdmitUsers = () => ({
  type: types.BULK_ADMIT_USERS,
});

const requestBulkAdmitUsersSuccess = () => ({
  type: types.BULK_ADMIT_USERS_SUCCESS,
});

const requestBulkAdmitUsersError = (errors) => ({
  type: types.BULK_ADMIT_USERS_ERROR,
  errors,
});

export const fetchUsers = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestFetchUsers());
    const payload = await getUsers(params, token);
    const { data: { users = [], totalCount, filters = [] } } = payload;

    dispatch(requestFetchUsersSuccess(users, totalCount, filters));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchUsersError(errMessage));
  }
};

export const updateUserAvailableInvitationsCount = (userId, amount) => async (dispatch) => {
  try {
    dispatch(requestUpdateUserAvailableInvitations());
    await updateUserInvitations(userId, { amount });

    dispatch(requestUpdateUserAvailableInvitationsSuccess());
    return Promise.resolve();
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestUpdateUserAvailableInvitationsError(errMessage));
    return Promise.reject();
  }
};

export const updateStatus = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestUpdateUserStatus());
    const payload = await updateUserStatus(params, token);
    const { data: { users = [] } } = payload;

    dispatch(requestUpdateUserStatusSuccess(users));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestUpdateUserStatusError(errMessage));
  }
};

export const bulkAdmitUsers = (bulkCount) => async (dispatch) => {
  try {
    dispatch(requestBulkAdmitUsers());
    await bulkAdmit({ bulkCount });
    dispatch(requestBulkAdmitUsersSuccess());
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestBulkAdmitUsersError(errMessage));
  }
};

const requestTimeToValueMetric = () => ({
  type: types.REQUEST_TIME_TO_VALUE_METRIC,
});

const requestTimeToValueMetricSuccess = (metric, totalCount) => ({
  type: types.REQUEST_TIME_TO_VALUE_METRIC_SUCCESS,
  metric,
  totalCount,
});

const requestTimeToValueMetricError = (errors) => ({
  type: types.REQUEST_TIME_TO_VALUE_METRIC_ERROR,
  errors,
});

export const fetchTimeToValueMetric = (params) => async (dispatch) => {
  try {
    dispatch(requestTimeToValueMetric());
    const payload = await getTimeToValueMetric(params);
    const { data: { metric = [], totalCount = 0 } } = payload;
    dispatch(requestTimeToValueMetricSuccess(metric, totalCount));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestTimeToValueMetricError(errMessage));
  }
};

export const exportTimeToValueMetric = async (params = {}, token) => {
  try {
    const payload = await exportTimeToValue(params, token);
    const { data } = payload;

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `time_to_value_${format(new Date(), 'yyyyMMdd')}.csv`);

    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(error);
  }
};

export const exportUsers = async (params = {}, token) => {
  try {
    const payload = await exportUsersApi(params, token);
    const { data } = payload;

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `users_${format(new Date(), 'yyyyMMdd')}.csv`);

    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(error);
  }
};
