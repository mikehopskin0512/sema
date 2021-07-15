import { format } from 'date-fns';
import { exportShareOfWalletMetrics, getShareOfWalletMetrics } from './api';
import * as types from './types';

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
}
