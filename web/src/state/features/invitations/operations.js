import * as actions from './actions';
import { authOperations } from '../auth';

const { hydrateUser } = authOperations;

const createInviteAndHydrateUser = (invitationData, token) => async (dispatch) => {
  try {
    const response = await dispatch(actions.createInvite(invitationData, token)) || {};
    if (!response.user) {
      throw new Error('No user returned!');
    }
    dispatch(hydrateUser(response.user));
  } catch (err) {
    const error = new Error(err);
    return error;
  }

  return true;
};

const revokeInviteAndHydrateUser = (id, userId, token, recipient) => async (dispatch) => {
  try {
    const response = await dispatch(actions.revokeInvite(id, userId, token, recipient)) || {};
    if (!response.user) {
      throw new Error('No user returned!');
    }
    dispatch(hydrateUser(response.user));
  } catch (err) {
    const error = new Error(err);
    return error;
  }

  return true;
};

export default { ...actions, createInviteAndHydrateUser, revokeInviteAndHydrateUser };
