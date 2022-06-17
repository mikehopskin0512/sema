import * as actions from './actions';
import { notify } from '../../../components/toaster/index';

const duplicateSnapshot = (snapshotToDuplicate, token) => async (dispatch) => {
  try {
    let newSnapshot = { ...snapshotToDuplicate };
    delete newSnapshot.portolios;
    delete newSnapshot._id;
    newSnapshot.title = `${newSnapshot.title} (copy)`;
    await dispatch(actions.createSnapshot(newSnapshot, null, token));
    notify('Snapshot was successfully duplicated', { type: 'success' });
  } catch (error) {
    const {
      response: {
        data: { message },
        status,
        statusText,
      },
    } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(actions.requestCreateSnapshotError(errMessage));
    notify('Snapshot was not duplicated', { type: 'error' })
  }
};

export default { ...actions, duplicateSnapshot };
