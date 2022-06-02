import {
  getRoles,
  patchUserRole,
  deleteUserRole,
} from './api';
import * as types from './types';

const fetchRolesRequest = () => ({
  type: types.FETCH_ROLES,
});

const fetchRolesSuccess = (roles) => ({
  type: types.FETCH_ROLES_SUCCESS,
  roles,
});

const fetchRolesError = (errors) => ({
  type: types.FETCH_ROLES_ERROR,
  errors,
});

const updateUserRoleRequest = () => ({
  type: types.UPDATE_USER_ROLE,
});

const updateUserRoleSuccess = () => ({
  type: types.UPDATE_USER_ROLE_SUCCESS,
});

const updateUserRoleError = (errors) => ({
  type: types.UPDATE_USER_ROLE_ERROR,
  errors,
});

const removeUserRoleRequest = () => ({
  type: types.REMOVE_USER_ROLE,
});

const removeUserRoleSuccess = () => ({
  type: types.REMOVE_USER_ROLE_SUCCESS,
});

const removeUserRoleError = (errors) => ({
  type: types.REMOVE_USER_ROLE_ERROR,
  errors,
});


export const fetchRoles = (token) => async (dispatch) => {
  try {
    dispatch(fetchRolesRequest());
    const payload = await getRoles(token);
    const { data } = payload;
    dispatch(fetchRolesSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(fetchRolesError(errMessage));
  }
};

export const updateUserRole = (userRoleId, data, token) => async (dispatch) => {
  try {
    dispatch(updateUserRoleRequest());
    await patchUserRole(userRoleId, data, token);
    dispatch(updateUserRoleSuccess());
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(updateUserRoleError(errMessage));
  }
};

export const removeUserRole = (organizationId, userRoleId, token) => async (dispatch) => {
  try {
    dispatch(removeUserRoleRequest());
    await deleteUserRole(organizationId, userRoleId, token);
    dispatch(removeUserRoleSuccess());
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(removeUserRoleError(errMessage));
  }
};
