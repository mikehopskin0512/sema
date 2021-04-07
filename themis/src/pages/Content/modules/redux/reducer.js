import { cloneDeep } from 'lodash';

import initialState from './initialState';
import {
  ADD_SEMA_COMPONENTS,
  TOGGLE_TAG_MODAL,
  CLOSE_ALL_MODALS,
  UPDATE_SELECTED_EMOJI,
  UPDATE_SELECTED_TAGS,
  TOGGLE_SEARCH_MODAL,
  ADD_SUGGESTED_TAGS,
  UPDATE_SELECTED_TAG_WITH_SUGGESTION,
  TOGGLE_GLOBAL_SEARCH_MODAL,
  TOGGLE_GLOBAL_SEARCH_LOADING,
} from './actionConstants';
import {
  getInitialSemaValues,
  toggleTagSelection,
  getSemaIds,
} from '../content-util';

import { ADD_OP, SELECTED, GLOBAL_SEMA_SEARCH_ID } from '../../constants';

function rootReducer(state = initialState, action) {
  const { type, payload = {} } = action;
  console.log(action);

  const newState = cloneDeep(state);

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
      isReactionDirty: false,
      isTagDirty: false,
      suggestedTags: [],
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
    const { id, selectedReaction, isDirty } = payload;
    const { semabars } = newState;
    semabars[id].selectedReaction = selectedReaction;
    semabars[id].isReactionDirty = !!isDirty;
  } else if (type === UPDATE_SELECTED_TAGS) {
    const { id, operation, isDirty } = payload;
    const {
      semabars,
      semabars: {
        [id]: { selectedTags },
      },
    } = newState;
    const updatedTags = toggleTagSelection(operation, selectedTags);
    semabars[id].selectedTags = updatedTags;
    semabars[id].isTagDirty = !!isDirty;
  } else if (type === TOGGLE_SEARCH_MODAL) {
    const { id } = payload;
    const { semasearches } = newState;
    semasearches[id].isSearchModalVisible = !semasearches[id]
      .isSearchModalVisible;
  } else if (type === ADD_SUGGESTED_TAGS) {
    const { id, suggestedTags } = payload;
    const {
      semabars,
      semabars: {
        [id]: { selectedTags },
      },
    } = newState;

    const filteredSeggestions = suggestedTags.filter((suggestion) => {
      const exists = !!selectedTags.find(
        (tagObj) => tagObj[tagObj[SELECTED]] === suggestion
      );
      return !exists;
    });

    semabars[id].suggestedTags = filteredSeggestions;
  } else if (type === UPDATE_SELECTED_TAG_WITH_SUGGESTION) {
    const { id, tag } = payload;
    // add to selected
    const {
      semabars,
      semabars: {
        [id]: { selectedTags, suggestedTags },
      },
    } = newState;

    // remove from suggestion
    semabars[id].suggestedTags = suggestedTags.filter(
      (suggestedTag) => suggestedTag !== tag
    );

    const operation = { tag, op: ADD_OP };
    const updatedTags = toggleTagSelection(operation, selectedTags);
    semabars[id].selectedTags = updatedTags;
  } else if (type === TOGGLE_GLOBAL_SEARCH_MODAL) {
    const { data, position, isLoading = false } = payload;
    const obj = {};
    if (data) {
      //open with data
      obj.data = data;
      obj.position = position;
      obj.isOpen = true;
      obj.isLoading = isLoading;
    } else {
      // close
      obj.data = null;
      obj.isOpen = false;
    }
    newState[GLOBAL_SEMA_SEARCH_ID] = obj;
  } else if (type === TOGGLE_GLOBAL_SEARCH_LOADING) {
    const { isLoading } = payload;
    newState[GLOBAL_SEMA_SEARCH_ID].isLoading = isLoading;
  }
  return newState;
}

export default rootReducer;
