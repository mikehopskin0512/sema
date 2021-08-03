/* eslint-disable import/prefer-default-export */
import { find, flatten, size, uniqBy } from 'lodash';
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
    if (engGuides.data) {
      const { data } = engGuides;
      const engGuideCollections = uniqBy(flatten(data.map((item) => item.collections)), '_id');
      const collectionsWithCommentCount = engGuideCollections.map((item) => {
        const { _id } = item;
        const commentCount = data.filter((guide) => size(find(guide.collections, { _id })) > 0);
        return {
          collectionData: {
            ...item,
            comments: commentCount,
          },
        };
      });
      dispatch(fetchEngGuidesSuccess(collectionsWithCommentCount));
    }
  } catch (error) {
    const { response: { data: { message }, status, statusText } } = error;
    const errMessage = message || `${status} - ${statusText}`;
    dispatch(fetchEngGuidesError(errMessage));
  }
};
