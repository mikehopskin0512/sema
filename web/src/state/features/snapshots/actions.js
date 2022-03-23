import * as types from './types';
import { getUserSnapshots, putSnapshot } from './api';

const requestFetchUserSnapshots = () => ({
  type: types.REQUEST_FETCH_USER_SNAPSHOTS,
});

const requestFetchUserSnapshotsSuccess = (snapshots) => ({
  type: types.REQUEST_FETCH_USER_SNAPSHOTS_SUCCESS,
  snapshots,
});

const requestFetchUserSnapshotsError = (errors) => ({
  type: types.REQUEST_FETCH_USER_SNAPSHOTS_ERROR,
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

export const fetchUserSnapshots = (userId, token) => async (dispatch) => {
  try {
    dispatch(requestFetchUserSnapshots());
    const payload = await getUserSnapshots(userId, token);
    const { data } = payload;
    dispatch(requestFetchUserSnapshotsSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(requestFetchUserSnapshotsError(errMessage));
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
