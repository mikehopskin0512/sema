import { format } from 'date-fns';
import { exportUserActivityChangeMetrics, getUserActivityChangeMetrics } from './api';
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
