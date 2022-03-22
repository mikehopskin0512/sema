import * as types from './types';
import { getPortfolio, putPortfolio, getUserPortfolio, postSnapshotToPortfolio } from './api';
import { deleteSnapshot, putSnapshot } from '../snapshots/api';

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

const requestRemoveSnapshotSuccess = (portfolio) => ({
  type: types.REQUEST_REMOVE_SNAPSHOT_SUCCESS,
  portfolio,
});

const requestRemoveSnapshotError = (errors) => ({
  type: types.REQUEST_REMOVE_SNAPSHOT_ERROR,
  errors,
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

export const fetchPortfoliosOfUser = (userId, token) => async (dispatch) => {
  try {
    dispatch(requestFetchUserPortfolio());
    const payload = await getUserPortfolio(userId, token);
    const { data } = payload;
    dispatch(requestFetchUserPortfolioSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
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
    const { response: { data: { message }, status, statusText } } = error;
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
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestUpdatePortfolioError(errMessage));
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
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestUpdateSnapshotError(errMessage));
    return error.response;
  }
};

export const removeSnapshot = (portfolioId, snapshotId, token) => async (dispatch) => {
  try {
    dispatch(requestRemoveSnapshot());
    const payload = await deleteSnapshot({ portfolioId, snapshotId }, token);
    const { data } = payload;
    const { portfolio } = data;
    dispatch(requestRemoveSnapshotSuccess(portfolio));
    return payload;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestRemoveSnapshotError(errMessage));
    return error.response;
  }
};

export const addSnapshotToPortfolio = (portfolioId, body, token) => async (dispatch) => {
  try {
    dispatch(requestPostSnapshotToPortfolio());
    const payload = await postSnapshotToPortfolio(portfolioId, body, token);
    //const { data } = payload; 
    //ToDo: Fix this after backend will be ready
    dispatch(requestPostSnapshotToPortfolioSuccess());
    return payload;
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestPostSnapshotToPortfolioError(errMessage));
    return error.response;
  }
}
