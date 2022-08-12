import * as actions from './actions';
import { setActiveUserCollections } from '../auth/actions';
import { getOrgOverviewGraphs } from './api';

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

// TODO: add some redux actions for fetching when it will be needed
export const getInsightsGraphsData = async (filter, token) => {
  const { data } = await getOrgOverviewGraphs(filter, token);
  return data;
}

export default { ...actions, getUserComments, updateCollectionIsActiveAndFetchComments, getInsightsGraphsData };
