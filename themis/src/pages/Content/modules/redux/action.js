import {
  ADD_SEMABAR,
  TOGGLE_TAG_MODAL,
  CLOSE_ALL_MODALS,
  UPDATE_SELECTED_EMOJI,
  UPDATE_SELECTED_TAGS,
} from './actionConstants';

export const addSemabar = (payload) => ({ type: ADD_SEMABAR, payload });

export const toggleTagModal = (payload) => ({
  type: TOGGLE_TAG_MODAL,
  payload,
});

export const closeAllDropdowns = () => ({
  type: CLOSE_ALL_MODALS,
});

export const updateSelectedEmoji = (payload) => ({
  type: UPDATE_SELECTED_EMOJI,
  payload,
});

export const updateSelectedTags = (payload) => ({
  type: UPDATE_SELECTED_TAGS,
  payload,
});
