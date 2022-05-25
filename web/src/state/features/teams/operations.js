import * as actions from './actions';
import { setActiveOrganizationCollections } from './actions';
import { setSelectedOrganization } from '../auth/actions';
import { find } from 'lodash';

export const updateOrganizationCollectionIsActiveAndFetchCollections = (collectionId, teamId, token) => async (dispatch) => {
  try {
    await dispatch(setActiveOrganizationCollections(collectionId, teamId, token));
    const roles = await dispatch(actions.fetchOrganizationsOfUser(token))
    const activeTeam = find(roles, function(o) {
      return o.team?._id === teamId
    })
    if (activeTeam) {
      await dispatch(setSelectedOrganization(activeTeam))
    }
  } catch (err) {
    const error = new Error(err);
    return error;
  }
};

export const updateOrganizationRepositories = (teamId, repos, token) => async (dispatch) => {
  await dispatch(actions.editOrganizationRepos(teamId, repos, token));
  const teams = await dispatch(actions.fetchOrganizationsOfUser(token))
  const activeTeam = find(teams, (o) => {
    return o.team?._id === teamId
  })
  if (activeTeam) {
    await dispatch(setSelectedOrganization(activeTeam))
  }
}

export default { ...actions, updateTeamCollectionIsActiveAndFetchCollections: updateOrganizationCollectionIsActiveAndFetchCollections, updateTeamRepositories: updateOrganizationRepositories };
