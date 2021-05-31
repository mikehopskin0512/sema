import { cloneDeep } from 'lodash';
import jwt_decode from 'jwt-decode';

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
  ON_INPUT_GLOBAL_SEARCH,
  RESET_SEMA_STATES,
  UPDATE_GITHUB_TEXTAREA,
  UPDATE_SEMA_USER,
  ADD_SUGGESTED_COMMENTS,
  ADD_GITHUB_METADATA,
  ADD_SMART_COMMENT,
  ADD_MUTATION_OBSERVER,
  REMOVE_MUTATION_OBSERVER,
  UPDATE_SEARCH_BAR_INPUT_VALUE,
} from './actionConstants';
import {
  getInitialSemaValues,
  toggleTagSelection,
  getSemaIds,
} from '../content-util';

import {
  ADD_OP,
  SELECTED,
  SUGGESTED_TAG_LIMIT,
  GLOBAL_SEMA_SEARCH_ID,
  TAGS_INIT,
  EMOJIS,
} from '../../constants';

function rootReducer(state = initialState, action) {
  const { type, payload = {} } = action;

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
      suggestedTags: [],
    };

    newState.semasearches[semaSearchContainerId] = {
      isSearchModalVisible: false,
      selectedSuggestedComments: [],
      searchValue: '',
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
    const { id, selectedReaction, isReactionDirty = true } = payload;
    const { semabars } = newState;
    semabars[id].selectedReaction = selectedReaction;
    semabars[id].isReactionDirty = isReactionDirty;
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
        [id]: { selectedTags = [] },
      },
    } = newState;

    const filteredSuggestions = suggestedTags.filter((suggestion) => {
      const exists = !!selectedTags.find(
        (tagObj) => tagObj[tagObj[SELECTED]] === suggestion
      );
      return !exists;
    });

    const selectedTagsLength = selectedTags.filter((tagObj) => tagObj[SELECTED])
      .length;

    let numberOfAllowedSuggestions = SUGGESTED_TAG_LIMIT - selectedTagsLength;
    numberOfAllowedSuggestions =
      numberOfAllowedSuggestions < 0 ? 0 : numberOfAllowedSuggestions;

    while (filteredSuggestions.length > numberOfAllowedSuggestions) {
      filteredSuggestions.pop();
    }

    semabars[id].suggestedTags = filteredSuggestions;
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
    const { data, position, isLoading = false, openFor } = payload;
    const obj = {};
    if (data) {
      //open with data
      obj.data = data;
      obj.position = position;
      obj.isOpen = true;
      obj.isLoading = isLoading;
      obj.openFor = openFor;
    } else {
      // close
      obj.data = null;
      obj.isOpen = false;
    }
    newState[GLOBAL_SEMA_SEARCH_ID] = obj;
  } else if (type === TOGGLE_GLOBAL_SEARCH_LOADING) {
    const { isLoading } = payload;
    newState[GLOBAL_SEMA_SEARCH_ID].isLoading = isLoading;
  } else if (type === ON_INPUT_GLOBAL_SEARCH) {
    const { data } = payload;
    newState[GLOBAL_SEMA_SEARCH_ID].data = data;
  } else if (type === RESET_SEMA_STATES) {
    const { semabarContainerId, semaSearchContainerId } = payload;

    newState.semabars[semabarContainerId] = {
      isTagModalVisible: false,
      selectedTags: TAGS_INIT,
      selectedReaction: EMOJIS[0],
      isReactionDirty: false,
      suggestedTags: [],
    };

    newState.semasearches[semaSearchContainerId] = {
      isSearchModalVisible: false,
      selectedSuggestedComments: [],
      searchValue: '',
    };

    // Reset to default Github Metadata
    newState.githubMetadata.filename = null;
    newState.githubMetadata.file_extension = null;
    newState.githubMetadata.ine_numbers = null;
  } else if (type === UPDATE_GITHUB_TEXTAREA) {
    const { isTyping } = payload;
    newState.github.isTyping = isTyping;
  } else if (type === UPDATE_SEMA_USER) {
    const { token, isLoggedIn } = payload;
    if (token) {
      const { user } = jwt_decode(token);
      newState.user = { ...user, ...{ isLoggedIn} };
    } else {
      newState.user = { isLoggedIn };
    }
  } else if (type === ADD_SUGGESTED_COMMENTS) {
    const { id, suggestedComment } = payload;
    newState.semasearches[id].selectedSuggestedComments.push(suggestedComment);
  } else if (type === ADD_GITHUB_METADATA) {
    const metadata = payload;
    newState.githubMetadata = metadata;
  } else if (type === ADD_SMART_COMMENT) {
    const comment = payload;
    newState.smartComment = comment;
  } else if (type === ADD_MUTATION_OBSERVER) {
    const observer = payload;
    newState.observer = observer;
  } else if (type === REMOVE_MUTATION_OBSERVER) {
    newState.observer.disconnect();
  } else if (type === UPDATE_SEARCH_BAR_INPUT_VALUE) {
    const { id, searchValue } = payload;
    newState.semasearches[id].searchValue = searchValue;
  }
  return newState;
}

export default rootReducer;
