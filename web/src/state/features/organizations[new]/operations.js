import * as actions from './actions';
import { setActiveOrganizationCollections } from './actions';
import { setSelectedOrganization } from '../auth/actions';
import { find } from 'lodash';
import { fetchRepoFilters, requestClearRepoFilters } from '../repositories/actions';
import { parseErrorMessage } from '../../../utils/errorHandler';

export const updateOrganizationCollectionIsActiveAndFetchCollections = (collectionId, organizationId, token) => async (dispatch) => {
  try {
    await dispatch(setActiveOrganizationCollections(collectionId, organizationId, token));
    const roles = await dispatch(actions.fetchOrganizationsOfUser(token))
    const activeOrganization = find(roles, function (o) {
      return o.organization?._id === organizationId
    })
    if (activeOrganization) {
      await dispatch(setSelectedOrganization(activeOrganization))
    }
  } catch (err) {
    const error = new Error(err);
    return error;
  }
};

export const updateOrganizationRepositories = (organizationId, repos, token) => async (dispatch) => {
  await dispatch(actions.editOrganizationRepos(organizationId, repos, token));
  const organizations = await dispatch(actions.fetchOrganizationsOfUser(token))
  const activeOrganization = find(organizations, (o) => {
    return o.organization?._id === organizationId
  })
  if (activeOrganization) {
    await dispatch(setSelectedOrganization(activeOrganization))
  }
}

export const fetchOrgReposFilters = (repoIds, dateRange, token) => async (dispatch, getState) => {
  try {
    dispatch(actions.requestFetchOrganizationReposFilters());
    await dispatch(fetchRepoFilters(repoIds, dateRange, token))
    const { repositoriesState: { data: { filterValues } }, organizationsNewState: { repos } } = getState();
    const reposList = repos.map(({ name, externalId }) => ({
        name,
        label: name,
        value: externalId
      })) || [];
    dispatch(actions.requestFetchOrganizationReposFiltersSuccess({ ...filterValues, repos: reposList }));
    dispatch(requestClearRepoFilters());
  } catch (error) {
    const errMessage = parseErrorMessage(error)
    dispatch(actions.requestFetchOrganizationReposFiltersError(errMessage));
  }
}

export default { ...actions, updateorganizationCollectionIsActiveAndFetchCollections: updateOrganizationCollectionIsActiveAndFetchCollections, updateorganizationRepositories: updateOrganizationRepositories, fetchOrgReposFilters };
