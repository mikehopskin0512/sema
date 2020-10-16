import * as actions from './actions';
import { organizationsOperations } from '../organizations';

const { createOrg } = organizationsOperations;

const createAndJoinOrg = (userId, org, token) => async (dispatch) => {
  try {
    // Create new organization and await result
    const newOrg = await dispatch(createOrg(org, token)) || {};
    const { _id: orgId, orgName } = newOrg;

    if (!orgId) {
      throw new Error('Org create error');
    }

    // Update user record with new organization id
    const userOrg = { id: orgId, orgName };
    await dispatch(actions.joinOrg(userId, userOrg, token));
  } catch (err) {
    const error = new Error(err);
    return error;
  }

  return true;
};

export default { ...actions, createAndJoinOrg };
