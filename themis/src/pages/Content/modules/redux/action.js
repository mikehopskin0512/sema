import {
  ADD_SEMABAR,
  TOGGLE_TAG_MODAL,
  CLOSE_ALL_MODALS,
} from './actionConstants';

export const addSemabar = (payload) => ({ type: ADD_SEMABAR, payload });

export const toggleTagModal = (payload) => ({
  type: TOGGLE_TAG_MODAL,
  payload,
});

export const closeAllDropdowns = () => ({
  type: CLOSE_ALL_MODALS,
});
