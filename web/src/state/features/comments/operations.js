import * as actions from './actions';
import { setActiveUserCollections } from '../auth/actions';

export const getUserComments = ({ author, requester }, token) => async (dispatch) => {
  try {
    const params = {
      author,
      requester,
    };
    await dispatch(actions.fetchSmartComments(params, token))
  } catch (err) {
    const error = new Error(err);
    return error;
  }
};

// export const getUserReceivedComments = (username, token) => async (dispatch) => {
//   try {
//     const params = {
//       requester: username,
//     };
//     await dispatch(actions.fetchSmartComments(params, token))
//   } catch (err) {
//     const error = new Error(err);
//     return error;
//   }
// };

export const updateCollectionIsActiveAndFetchComments = (_id, token) => async (dispatch) => {
  try {
    await dispatch(setActiveUserCollections(_id, token));
    await dispatch(actions.getUserSuggestedComments(token));
  } catch (err) {
    const error = new Error(err);
    return error;
  }
};

export default { ...actions, getUserComments, updateCollectionIsActiveAndFetchComments };
