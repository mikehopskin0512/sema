import { format } from 'date-fns';
import {
  exportUserActivityChangeMetrics,
  getUserActivityChangeMetrics,
  exportShareOfWalletMetrics,
  getShareOfWalletMetrics,
  getGrowthOfRepositoryMetrics,
  exportGrowthOfRepositoryMetrics,
} from './api';
import * as types from './types';

const requestUserActivityChangeMetrics = () => ({
  type: types.REQUEST_USER_ACTIVITY_CHANGE_METRICS,
});

const requestUserActivityChangeMetricsSuccess = (userActivityMetrics, totalCount) => ({
  type: types.REQUEST_USER_ACTIVITY_CHANGE_METRICS_SUCCESS,
  userActivityMetrics,
  totalCount,
});

const requestUserActivityChangeMetricsError = (errors) => ({
  type: types.REQUEST_USER_ACTIVITY_CHANGE_METRICS_ERROR,
  errors,
});

export const fetchUserActivityMetrics = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestUserActivityChangeMetrics());
    const payload = await getUserActivityChangeMetrics(params, token);
    const { data: { userActivities = [], totalCount } } = payload;

    dispatch(requestUserActivityChangeMetricsSuccess(userActivities, totalCount));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestUserActivityChangeMetricsError(errMessage));
  }
};

export const exportUserActivityMetrics = async (params = {}, token) => {
  try {
    const payload = await exportUserActivityChangeMetrics(params, token);
    const { data } = payload;

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `user_activity_${format(new Date(), 'yyyyMMdd')}.csv`);

    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(error);
  }
};

const requestFetchSmartCommentsMetrics = () => ({
  type: types.REQUEST_FETCH_SHARE_OF_WALLET_METRICS,
});

const requestFetchSmartCommentsMetricsSuccess = (smartCommentMetrics, totalCount) => ({
  type: types.REQUEST_FETCH_SHARE_OF_WALLET_METRICS_SUCCESS,
  smartCommentMetrics,
  totalCount,
});

const requestFetchSmartCommentsMetricsError = (errors) => ({
  type: types.REQUEST_FETCH_SHARE_OF_WALLET_METRICS_ERROR,
  errors,
});

export const fetchSmartCommentsMetrics = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestFetchSmartCommentsMetrics());
    const payload = await getShareOfWalletMetrics(params, token);
    const { data: { comments = [], totalCount } } = payload;

    dispatch(requestFetchSmartCommentsMetricsSuccess(comments, totalCount));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestFetchSmartCommentsMetricsError(errMessage));
  }
};

export const exportSmartCommentsMetrics = async (params = {}, token) => {
  try {
    const payload = await exportShareOfWalletMetrics(params, token);
    const { data } = payload;

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `share_of_wallet_${format(new Date(), 'yyyyMMdd')}.csv`);

    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(error);
  }
};

const requestGrowthOfRepositoryMetrics = () => ({
  type: types.REQUEST_GROWTH_OF_REPOSITORY_METRICS,
});

const requestGrowthOfRepositoryMetricsSuccess = (growthOfRepository) => ({
  type: types.REQUEST_GROWTH_OF_REPOSITORY_METRICS_SUCCESS,
  growthOfRepository,
});

const requestGrowthOfRepositoryMetricsError = (errors) => ({
  type: types.REQUEST_GROWTH_OF_REPOSITORY_METRICS_ERROR,
  errors,
});

export const fetchGrowthOfRepositoryMetrics = (params = {}, token) => async (dispatch) => {
  try {
    dispatch(requestGrowthOfRepositoryMetrics());
    const payload = await getGrowthOfRepositoryMetrics(params, token);
    const { data: { growthOfRepository = [] } } = payload;

    dispatch(requestGrowthOfRepositoryMetricsSuccess(growthOfRepository));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(requestGrowthOfRepositoryMetricsError(errMessage));
  }
};

export const exportGrowthOfRepository = async (params = {}, token) => {
  try {
    const payload = await exportGrowthOfRepositoryMetrics(params, token);
    const { data } = payload;

    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `growth_of_repository_${format(new Date(), 'yyyyMMdd')}.csv`);

    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error(error);
  }
};
