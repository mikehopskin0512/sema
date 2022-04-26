import React from 'react';
import toast from 'toasted-notes';
import { AlertFilledIcon } from '../../../components/Icons';
import * as types from './types';
import {
  getPortfolio,
  putPortfolio,
  getUserPortfolio,
  deletePortfolio,
  patchPortfolioType,
  createPortfolio,
  deleteSnapshotsFromPortfolio,
  patchPortfolioTitle,
  addSnapshotToPortfolio,
  patchPortfolioOverview,
} from './api';
import { putSnapshot } from '../snapshots/api';
import PortfolioListNotification from '../../../pages/portfolios/components/notification';
import { requestAddSnapshotToPortfolio } from '../snapshots/actions';

const requestFetchUserPortfolio = () => ({
  type: types.REQUEST_FETCH_USER_PORTFOLIO,
});

const requestFetchUserPortfolioSuccess = (portfolios) => ({
  type: types.REQUEST_FETCH_USER_PORTFOLIO_SUCCESS,
  portfolios,
});

const requestFetchUserPortfolioError = (errors) => ({
  type: types.REQUEST_FETCH_USER_PORTFOLIO_ERROR,
  errors,
});

const requestFetchPortfolio = () => ({
  type: types.REQUEST_FETCH_PORTFOLIO,
});

const requestFetchPortfolioSuccess = (portfolio) => ({
  type: types.REQUEST_FETCH_PORTFOLIO_SUCCESS,
  portfolio,
});

const requestFetchPortfolioError = (errors) => ({
  type: types.REQUEST_FETCH_PORTFOLIO_ERROR,
  errors,
});

const requestUpdatePortfolio = () => ({
  type: types.REQUEST_UPDATE_PORTFOLIO,
});

const requestUpdatePortfolioSuccess = (portfolio) => ({
  type: types.REQUEST_UPDATE_PORTFOLIO_SUCCESS,
  portfolio,
});

const requestUpdatePortfolioError = (errors) => ({
  type: types.REQUEST_UPDATE_PORTFOLIO_ERROR,
  errors,
});

const requestUpdateSnapshot = () => ({
  type: types.REQUEST_UPDATE_SNAPSHOT,
});

const requestUpdateSnapshotSuccess = (snapshot) => ({
  type: types.REQUEST_UPDATE_SNAPSHOT_SUCCESS,
  snapshot,
});

const requestUpdateSnapshotError = (errors) => ({
  type: types.REQUEST_UPDATE_SNAPSHOT_ERROR,
  errors,
});

const requestRemoveSnapshot = () => ({
  type: types.REQUEST_REMOVE_SNAPSHOT,
});

const requestRemoveSnapshotSuccess = (portfolioId, deletedSnapshots) => ({
  type: types.REQUEST_REMOVE_SNAPSHOT_SUCCESS,
  portfolioId,
  deletedSnapshots,
});

const requestRemoveSnapshotError = (errors) => ({
  type: types.REQUEST_REMOVE_SNAPSHOT_ERROR,
  errors,
});

const requestRemovePortfolio = () => ({
  type: types.REQUEST_REMOVE_PORTFOLIO,
});

const requestRemovePortfolioSuccess = (portfolioId) => ({
  type: types.REQUEST_REMOVE_PORTFOLIO_SUCCESS,
  portfolioId,
});

const requestRemovePortfolioError = (errors) => ({
  type: types.REQUEST_REMOVE_PORTFOLIO_ERROR,
  errors,
});

const requestUpdatePortfolioField = (portfolioId, field, value) => ({
  type: types.REQUEST_UPDATE_PORTFOLIO_FIELD,
  portfolioId,
  field,
  value,
});

const requestUpdatePortfolioFieldError = (error, portfolioId, field, initialValue) => ({
  type: types.REQUEST_UPDATE_PORTFOLIO_FIELD_ERROR,
  error,
  initialValue,
  field,
  portfolioId,
});

const requestPostSnapshotToPortfolio = () => ({
  type: types.REQUEST_POST_SNAPSHOT_TO_PORTFOLIO,
});

const requestPostSnapshotToPortfolioSuccess = () => ({
  //ToDo: add data after backend will be ready
  type: types.REQUEST_POST_SNAPSHOT_TO_PORTFOLIO_SUCCESS,
});

const requestPostSnapshotToPortfolioError = (errors) => ({
  type: types.REQUEST_POST_SNAPSHOT_TO_PORTFOLIO_ERROR,
  errors,
});

const requestCopyPortfolio = () => ({
  type: types.REQUEST_PORTFOLIO_COPY,
});

const requestCopyPortfolioError = (errors) => ({
  type: types.REQUEST_PORTFOLIO_COPY_ERROR,
  errors,
});

const requestCopyPortfolioSuccess = (portfolio) => ({
  type: types.REQUEST_PORTFOLIO_COPY_SUCCESS,
  portfolio,
});

export const fetchPortfoliosOfUser = (userId, token) => async (dispatch) => {
  try {
    dispatch(requestFetchUserPortfolio());
    const payload = await getUserPortfolio(userId, token);
    const { data } = payload;
    dispatch(requestFetchUserPortfolioSuccess(data));
  } catch (error) {
    const {
      response: {
        status,
        statusText,
      },
    } = error;
    const errMessage = `${status} - ${statusText}`;
    dispatch(requestFetchUserPortfolioError(errMessage));
  }
};

export const fetchPortfolio = (id) => async (dispatch) => {
  try {
    dispatch(requestFetchPortfolio());
    const payload = await getPortfolio(id);
    const { data } = payload;
    dispatch(requestFetchPortfolioSuccess(data));
  } catch (error) {
    const {
      response: {
        status,
        statusText,
      },
    } = error;
    const errMessage = `${status} - ${statusText}`;
    dispatch(requestFetchPortfolioError(errMessage));
  }
};

export const updatePortfolio = (id, body, token) => async (dispatch) => {
  try {
    dispatch(requestUpdatePortfolio());
    const payload = await putPortfolio(id, body, token);
    const { data } = payload;
    dispatch(requestUpdatePortfolioSuccess(data));
    return payload;
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestUpdatePortfolioError(errMessage));
    return error.response;
  }
};

export const copyExistingPortfolio = (portfolio, token) => async (dispatch) => {
  try {
    dispatch(requestCopyPortfolio());
    const { data } = await createPortfolio(portfolio, token);
    dispatch(requestCopyPortfolioSuccess(data));
    return data;
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestCopyPortfolioError(errMessage));

    // TODO: add general component for notifications
    toast.notify(({ onClose }) => (
      <PortfolioListNotification
        text="Portfolio was not duplicated"
        icon={<AlertFilledIcon size="small" />}
        onClose={onClose}
        onRetry={() => dispatch(copyExistingPortfolio(portfolio, token))} />
    ), {
      duration: 3000,
      position: 'bottom-left',
    });

    return error.response;
  }
};

export const updateSnapshot = (id, body, token) => async (dispatch) => {
  try {
    dispatch(requestUpdateSnapshot());
    const payload = await putSnapshot(id, body, token);
    const { data } = payload;
    dispatch(requestUpdateSnapshotSuccess(data));
    return payload;
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestUpdateSnapshotError(errMessage));
    return error.response;
  }
};

export const removeSnapshotsFromPortfolio = (portfolioId, snapshots, token) => async (dispatch) => {
  try {
    dispatch(requestRemoveSnapshot());
    await deleteSnapshotsFromPortfolio(
      portfolioId,
      snapshots,
      token,
    );
    dispatch(requestRemoveSnapshotSuccess(portfolioId, snapshots));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestRemoveSnapshotError(errMessage));
    return error.response;
  }
};

export const updatePortfolioField = (portfolioId, field, value, updateRequest) => (dispatch, getState) => {
  const { portfoliosState: { data: { portfolios } }, authState: { token } } = getState();
  const initialValue = portfolios.find(({ _id }) => _id === portfolioId)[field];
  try {
    dispatch(requestUpdatePortfolioField(portfolioId, field, value));
    updateRequest(portfolioId, value, token);
  } catch (error) {
    dispatch(requestUpdatePortfolioFieldError(portfolioId, field, initialValue));
    return error.response;
  }
};
export const updatePortfolioType = (portfolioId, type) => {
  return updatePortfolioField(portfolioId, 'type', type, patchPortfolioType);
};
export const updatePortfolioOverview = (portfolioId, overview) => {
  return updatePortfolioField(portfolioId, 'overview', overview, patchPortfolioOverview);
};
export const updatePortfolioTitle = (portfolioId, title) => {
  return updatePortfolioField(portfolioId, 'title', title, patchPortfolioTitle);
};

export const removePortfolio = (portfolioId, token) => async (dispatch) => {
  try {
    dispatch(requestRemovePortfolio());
    const payload = await deletePortfolio(portfolioId, token);
    dispatch(requestRemovePortfolioSuccess(portfolioId));
    return payload;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestRemovePortfolioError(errMessage));
    return error.response;
  }
};

export const addSnapshotsToPortfolio = ({
  portfolioId,
  snapshots,
  token,
  onSuccess,
  onError,
  type = 'dashboard',
  userId
}) => async (dispatch) => {
  try {
    const { data } = await addSnapshotToPortfolio(portfolioId, snapshots, token);
    const { data: userPortfoliosData } = await getUserPortfolio(userId, token);

    dispatch(requestFetchUserPortfolioSuccess(userPortfoliosData));

    if (type === 'dashboard') {
      dispatch(requestFetchPortfolioSuccess(data));
    }

    if (type === 'list') {
      dispatch(requestAddSnapshotToPortfolio(snapshots[0], portfolioId))
    }

    if (typeof onSuccess === 'function') onSuccess(snapshots);

  } catch (error) {
    const {
      response: {
        status,
        statusText,
      },
    } = error;

    if (typeof onError === 'function') onError();

    const errMessage = `${status} - ${statusText}`;
    dispatch(requestFetchPortfolioError(errMessage));
  }
}
