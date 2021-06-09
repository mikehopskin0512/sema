import Router from 'next/router';
import * as actions from './actions';
import jwtDecode from 'jwt-decode';
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
    const userOrg = { id: orgId, orgName, isAdmin: true };
    await dispatch(actions.joinOrg(userId, userOrg, token));
  } catch (err) {
    const error = new Error(err);
    return error;
  }

  return true;
};

const registerAndAuthUser = (user, invitation = {}) => async (dispatch) => {
  try {

    const payload = await dispatch(actions.registerUser(user, invitation));
    const { data: { jwtToken } } = payload;
    const { user: newUser } = jwtDecode(jwtToken) || {};
    const { verificationToken } = newUser;
    await dispatch(actions.activateUser(verificationToken));

    Router.push('/dashboard');
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;

    dispatch(triggerAlert(errMessage, 'error'));
  }
};

export default { ...actions, createAndJoinOrg, registerAndAuthUser };
