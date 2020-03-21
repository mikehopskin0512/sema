import * as actions from './actions';

const fetchFilterLists = (orgId, token) => async (dispatch) => {
  // Fetch filter lists for repositories, developers, fileTypes
  dispatch(actions.fetchRepositories(orgId, token));
  dispatch(actions.fetchDevelopers(orgId, token));
  dispatch(actions.fetchFileTypes(orgId, token));
};

export default { ...actions, fetchFilterLists };
