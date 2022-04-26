import * as types from "./types";
import { deleteSnapshot, getUserSnapshots, postSnapshots, putSnapshot } from "./api";
import { notify } from '../../../components/toaster/index';

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

export const requestUpdateSnapshotSuccess = (snapshot) => ({
  type: types.REQUEST_UPDATE_SNAPSHOT_SUCCESS,
  snapshot,
});

const requestUpdateSnapshotError = (errors) => ({
  type: types.REQUEST_UPDATE_SNAPSHOT_ERROR,
  errors,
});

const deleteSnapshotRequest = () => ({
  type: types.REQUEST_DELETE_SNAPSHOT,
});

const deleteSnapshotError = (errors) => ({
  type: types.REQUEST_DELETE_SNAPSHOT_ERROR,
  errors,
});

const deleteSnapshotSuccess = (id) => ({
  type: types.REQUEST_DELETE_SNAPSHOT_SUCCESS,
  id,
});

export const fetchUserSnapshots = (userId, token) => async (dispatch) => {
  try {
    dispatch(requestFetchUserSnapshots());
    const payload = await getUserSnapshots(userId, token);
    const { data } = payload;
    dispatch(requestFetchUserSnapshotsSuccess(data));
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(deleteSnapshotError(errMessage));
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

export const createSnapshot = (snapshot, token) => async (
  dispatch,
  getState
) => {
  try {
    const {
      snapshotsState: {
        data: { snapshots: previousSnapshots },
      },
    } = getState();
    dispatch(requestFetchUserSnapshots());
    const payload = await postSnapshots(snapshot, token);
    const { data: createdSnapshot } = payload;
    const newSnapshots = [...previousSnapshots, createdSnapshot];
    dispatch(requestFetchUserSnapshotsSuccess(newSnapshots));
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

export const duplicateSnapshot = (snapshotToDuplicate, token) => async (
  dispatch,
  getState
) => {
  try {
    let newSnapshot = { ...snapshotToDuplicate };
    delete newSnapshot.portolios;
    delete newSnapshot._id;
    newSnapshot.title = `${newSnapshot.title} (copy)`;
    await dispatch(createSnapshot(newSnapshot, token));
    notify('Snapshot was successfully duplicated', { type: 'success'});
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
    notify('Snapshot was not duplicated', { type: 'error'})
  }
};

export const deleteUserSnapshot = (snapshotId, token) => async (dispatch) => {
  try {
    dispatch(deleteSnapshotRequest());
    await deleteSnapshot(snapshotId, token);
    dispatch(deleteSnapshotSuccess(snapshotId));
    notify("Snapshot was successfully deleted");
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(deleteSnapshotError(errMessage));
    notify("Snapshot was not deleted", {
      type: 'error'
    });
  }
};
