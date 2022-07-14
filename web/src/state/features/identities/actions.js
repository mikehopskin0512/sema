import {
  connectOrganization,
} from './api';
import * as types from './types';

const connectOrgRequest = () => ({
  type: types.CONNECT_ORG,
});

const connectOrgSuccess = () => ({
  type: types.CONNECT_ORG_SUCCESS,
});

const connectOrgError = (errors) => ({
  type: types.CONNECT_ORG_ERROR,
  errors,
});


export const connectOrg = (token) => async (dispatch) => {
  try {
    dispatch(connectOrgRequest());
    const res = await connectOrganization(token);
    dispatch(connectOrgSuccess());
    return Promise.resolve(res);
  } catch (error) {
    const { response: { data } } = error;
    dispatch(connectOrgError(data));
    return Promise.reject(data)
  }
};
