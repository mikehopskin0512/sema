import * as actions from './actions';
import { organizationsOperations } from '../organizations';

const { createOrg } = organizationsOperations;

const createAndJoinOrg = (userId, org, token) => async (dispatch) => {
  // Create new organization and await result
  const newOrg = await dispatch(createOrg(org, token));
  const { _id: orgId } = newOrg;

  // Update user record with new organization id
  await dispatch(actions.joinOrg(userId, orgId, token));
};

export default { ...actions, createAndJoinOrg };
