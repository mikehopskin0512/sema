import { clone } from 'ramda';

import initialState from './initialState';
import {
  ADD_SEMABAR,
  TOGGLE_TAG_MODAL,
  CLOSE_ALL_MODALS,
  UPDATE_SELECTED_EMOJI,
  UPDATE_SELECTED_TAGS,
} from './actionConstants';
import { getInitialSemaValues, toggleTagSelection } from '../content-util';

function rootReducer(state = initialState, action) {
  const { type, payload } = action;

  console.log('-->', action.type);

  const newState = clone(state);

  if (type === ADD_SEMABAR) {
    const { id, activeElement } = payload;

    const { initialTags, initialReaction } = getInitialSemaValues(
      activeElement
    );

    newState.semabars[id] = {
      isTagModalVisible: false,
      selectedTags: initialTags,
      selectedReaction: initialReaction,
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
  } else if (type === UPDATE_SELECTED_EMOJI) {
    const { id, selectedReaction } = payload;
    const { semabars } = newState;
    semabars[id].selectedReaction = selectedReaction;
  } else if (type === UPDATE_SELECTED_TAGS) {
    const { id, operation } = payload;
    const {
      semabars,
      semabars: {
        [id]: { selectedTags },
      },
    } = newState;
    const updatedTags = toggleTagSelection(operation, selectedTags);
    semabars[id].selectedTags = updatedTags;
  }
  return newState;
}

export default rootReducer;
