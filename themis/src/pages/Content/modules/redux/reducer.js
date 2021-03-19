import initialState from './initialState';
import {
  ADD_SEMABAR,
  TOGGLE_TAG_MODAL,
  CLOSE_ALL_MODALS,
} from './actionConstants';

import { clone } from 'ramda';

function rootReducer(state = initialState, action) {
  const { type, payload } = action;

  const newState = clone(state);

  if (type === ADD_SEMABAR) {
    const { id } = payload;
    newState.semabars[id] = {
      isTagModalVisible: false,
      selectedTags: [],
      // ABHISHEK: it is "none" emoji here
      selectedEmoji: null,
    };
  } else if (type === TOGGLE_TAG_MODAL) {
    const { id } = payload;
    const { semabars } = newState;
    semabars[id].isTagModalVisible = !semabars[id].isTagModalVisible;
  } else if (type === CLOSE_ALL_MODALS) {
    // ABHISHEK: IMPLEMENT FOR SEARCH DROPDOWN TOO
    const semaIds = Object.keys(newState.semabars);
    semaIds.forEach((id) => {
      newState.semabars[id].isTagModalVisible = false;
    });
  }
  return newState;
}

export default rootReducer;
