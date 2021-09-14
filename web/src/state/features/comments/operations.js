import * as actions from './actions';

export const getUserComments = (username, token) => async (dispatch) => {
  try {
    const params = {
      author: username,
    };
    await dispatch(actions.fetchSmartComments(params, token))
  } catch (err) {
    const error = new Error(err);
    return error;
  }
};

export const getUserReceivedComments = (username, token) => async (dispatch) => {
  try {
    const params = {
      requester: username,
    };
    await dispatch(actions.fetchSmartComments(params, token))
  } catch (err) {
    const error = new Error(err);
    return error;
  }
};

export default { ...actions, getUserComments, getUserReceivedComments };
