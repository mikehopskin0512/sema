import * as actions from './actions';
import { getCollectionById } from '../comments/actions';
import { setSelectedTeam } from '../auth/actions';
import { find } from 'lodash';

export const updateTeamCollectionIsActiveAndFetchCollections = (body, collectionId, token) => async (dispatch) => {
  try {
    const updatedTeam = { ...body }
    const { collections } = body;
    const newCollections = collections.map((item) => {
      if (item?.collectionData === collectionId) {
        return {
          collectionData: item?.collectionData,
          isActive: !item.isActive,
        }
      }
      return {
        collectionData: item?.collectionData,
        isActive: item.isActive,
      };

    });
    updatedTeam.collections = newCollections;
    await dispatch(actions.editTeam(updatedTeam, token));
    const roles = await dispatch(actions.fetchTeamsOfUser(token))
    const activeTeam = find(roles, function(o) {
      return o.team._id === updatedTeam._id
    })
    if (activeTeam) {
      await dispatch(setSelectedTeam(activeTeam))
    }
  } catch (err) {
    const error = new Error(err);
    return error;
  }
};

export default { ...actions, updateTeamCollectionIsActiveAndFetchCollections };
