import {
  addTeam,
} from './api';
import * as types from './types';

const createTeamRequest = () => ({
  type: types.CREATE_NEW_TEAM,
});

const createTeamSuccess = (tags) => ({
  type: types.CREATE_NEW_TEAM_SUCCESS,
  tags,
});

const createTeamError = (errors) => ({
  type: types.CREATE_NEW_TEAM_ERROR,
  errors,
});

export const createTeam = (body, token) => async (dispatch) => {
  try {
    dispatch(createTeamRequest());
    const payload = await addTeam(body, token);
    const { data } = payload;
    dispatch(createTeamSuccess(data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(createTeamError(errMessage));
  }
};
