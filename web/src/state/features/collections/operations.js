import * as actions from './actions';
import { setActiveUserCollections } from '../auth/actions';

export const updateCollectionIsActiveAndFetchCollections = (_id, token) => async (dispatch) => {
  try {
    await dispatch(setActiveUserCollections(_id, token));
    await dispatch(actions.fetchAllUserCollections(token));
  } catch (err) {
    const error = new Error(err);
    return error;
  }
};

export default { ...actions, updateCollectionIsActiveAndFetchCollections };
