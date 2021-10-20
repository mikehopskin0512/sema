import * as actions from './actions';

const deleteTagAndFetchTags = (id, token)  => async (dispatch) => {
  try {
    await dispatch(actions.removeTagById(id, token));
    dispatch(actions.fetchTagList(token));
  } catch (err) {
    const error = new Error(err);
    return error;
  }
}

export default { ...actions, deleteTagAndFetchTags };
