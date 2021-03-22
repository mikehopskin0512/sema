import { clone } from 'ramda';

import initialState from './initialState';
import {
  ADD_SEMA_COMPONENTS,
  TOGGLE_TAG_MODAL,
  CLOSE_ALL_MODALS,
  UPDATE_SELECTED_EMOJI,
  UPDATE_SELECTED_TAGS,
  TOGGLE_SEARCH_MODAL,
} from './actionConstants';
import {
  getInitialSemaValues,
  toggleTagSelection,
  getSemaIds,
} from '../content-util';

function rootReducer(state = initialState, action) {
  const { type, payload } = action;

  const newState = clone(state);

  if (type === ADD_SEMA_COMPONENTS) {
    const { seedId, activeElement } = payload;

    const { semabarContainerId, semaSearchContainerId } = getSemaIds(seedId);

    const { initialTags, initialReaction } = getInitialSemaValues(
      activeElement
    );

    newState.semabars[semabarContainerId] = {
      isTagModalVisible: false,
      selectedTags: initialTags,
      selectedReaction: initialReaction,
      isDirty: false,
    };

    newState.semasearches[semaSearchContainerId] = {
      isSearchModalVisible: false,
    };
  } else if (type === TOGGLE_TAG_MODAL) {
    const { id } = payload;
    const { semabars } = newState;
    semabars[id].isTagModalVisible = !semabars[id].isTagModalVisible;
  } else if (type === CLOSE_ALL_MODALS) {
    const { semabars, semasearches } = newState;
    const semaIds = Object.keys(semabars);
    const searchIds = Object.keys(semasearches);

    semaIds.forEach((id) => {
      semabars[id].isTagModalVisible = false;
    });
    searchIds.forEach((id) => {
      semasearches[id].isSearchModalVisible = false;
    });
  } else if (type === UPDATE_SELECTED_EMOJI) {
    const { id, selectedReaction } = payload;
    const { semabars } = newState;
    semabars[id].selectedReaction = selectedReaction;
    semabars[id].isDirty = true;
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
    // semabars[id].isDirty = true;
  } else if (type === TOGGLE_SEARCH_MODAL) {
    const { id } = payload;
    const { semasearches } = newState;
    semasearches[id].isSearchModalVisible = !semasearches[id]
      .isSearchModalVisible;
  }
  return newState;
}

export default rootReducer;
