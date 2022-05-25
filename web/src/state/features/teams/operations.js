import * as actions from './actions';
import { setSelectedOrganization } from '../auth/actions';
import { find } from 'lodash';
import { setActiveTeamCollections } from './actions';

export const updateTeamCollectionIsActiveAndFetchCollections = (collectionId, teamId, token) => async (dispatch) => {
  try {
    await dispatch(setActiveTeamCollections(collectionId, teamId, token));
    const roles = await dispatch(actions.fetchTeamsOfUser(token))
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

export const updateTeamRepositories = (teamId, repos, token) => async (dispatch) => {
  await dispatch(actions.editTeamRepos(teamId, repos, token));
  const teams = await dispatch(actions.fetchTeamsOfUser(token))
  const activeTeam = find(teams, (o) => {
    return o.team?._id === teamId
  })
  if (activeTeam) {
    await dispatch(setSelectedOrganization(activeTeam))
  }
}

export default { ...actions, updateTeamCollectionIsActiveAndFetchCollections, updateTeamRepositories };
