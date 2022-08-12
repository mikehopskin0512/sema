import * as actions from './actions';
import _ from "lodash";
import { getRepositoryCharts } from './api';

export const getUserRepositories = (repositories, token) => async (dispatch) => {
  try {
    dispatch(actions.requestGetUserRepos());
    const externalIds = repositories.map(repo => repo.id);

    const response = await dispatch(actions.filterSemaRepositories(externalIds, token));
    if (!response) {
      dispatch(actions.requestGetUserReposSuccess(repositories));
      return;
    }
    const semaRepo = response?.map(el => {
      const index = _.findIndex(repositories, { id: el.externalId});
      if (index !== -1) {
        repositories.splice(index, 1);
      }
      return { ...el, type: "sema" };
    });
    dispatch(actions.requestGetUserReposSuccess([...repositories, ...semaRepo]));
  } catch (err) {
    const error = new Error(err);
    dispatch(actions.requestGetUserReposError(error));
    // return error;
  }
};

export const getChartsData = async (params, token) => {
  const payload = await getRepositoryCharts(params, token);
  const { data } = payload;

  return data;
};

export default { ...actions, getUserRepositories, getChartsData };
