/* eslint-disable import/prefer-default-export */
import * as types from './types';
import { getAllEngGuides } from './api';

const fetchEngGuides = () => ({
  type: types.FETCH_ENG_GUIDES,
});

const fetchEngGuidesSuccess = (engGuides) => ({
  type: types.FETCH_ENG_GUIDES_SUCCESS,
  engGuides,
});

const fetchEngGuidesError = (error) => ({
  type: types.FETCH_ENG_GUIDES_ERROR,
  error,
});

export const getEngGuides = (token) => async (dispatch) => {
  try {
    dispatch(fetchEngGuides());
    const engGuides = await getAllEngGuides(token);
    dispatch(fetchEngGuidesSuccess(engGuides.data));
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(fetchEngGuidesError(errMessage));
  }
};
