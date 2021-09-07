import { cloneDeep } from 'lodash';
// eslint-disable-next-line camelcase
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
  TOGGLE_GLOBAL_SEARCH_MODAL,
  TOGGLE_GLOBAL_SEARCH_LOADING,
  ON_INPUT_GLOBAL_SEARCH,
  RESET_SEMA_STATES,
  UPDATE_GITHUB_TEXTAREA,
  UPDATE_SEMA_USER,
  ADD_SUGGESTED_COMMENTS,
  ADD_GITHUB_METADATA,
  ADD_SMART_COMMENT,
  UPDATE_SEARCH_BAR_INPUT_VALUE,
  CLOSE_SEARCH_MODAL,
  TOGGLE_IS_SELECTING_EMOJI,
  CLOSE_ALL_SELECTING_EMOJI,
  CLOSE_LOGIN_REMINDER,
} from './actionConstants';

// TODO: good if we can break cyclic dependencies
// eslint-disable-next-line import/no-cycle
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
  POSITIVE,
  NEGATIVE,
} from '../../constants';

function rootReducer(state = initialState, action) {
  const { type, payload = {} } = action;

  const newState = cloneDeep(state);

  if (type === ADD_SEMA_COMPONENTS) {
    const { seedId, activeElement } = payload;

    const { semabarContainerId, semaSearchContainerId } = getSemaIds(seedId);

    const { initialTags, initialReaction } = getInitialSemaValues(
      activeElement,
    );

    newState.semabars[semabarContainerId] = {
      isTagModalVisible: false,
      isSelectingEmoji: false,
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
    semabars[id].isTagModalDirty = true;
    semabars[id].isTagModalVisible = !semabars[id].isTagModalVisible;
  } else if (type === TOGGLE_IS_SELECTING_EMOJI) {
    const { id } = payload;
    const { semabars } = newState;
    semabars[id].isSelectingEmoji = !semabars[id].isSelectingEmoji;
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

    newState[GLOBAL_SEMA_SEARCH_ID].isOpen = false;
  } else if (type === CLOSE_ALL_SELECTING_EMOJI) {
    const { semabars } = newState;
    const semaIds = Object.keys(semabars);

    semaIds.forEach((id) => {
      semabars[id].isSelectingEmoji = false;
    });
  } else if (type === UPDATE_SELECTED_EMOJI) {
    const { id, selectedReaction, isReactionDirty = true } = payload;
    const { semabars } = newState;
    semabars[id].selectedReaction = selectedReaction;
    semabars[id].isReactionDirty = isReactionDirty;
  } else if (type === UPDATE_SELECTED_TAGS) {
    const { id, operation } = payload;
    const {
      semabars,
      semabars: {
        [id]: { selectedTags },
      },
    } = newState;
    const updatedTags = toggleTagSelection(operation, selectedTags, true);
    semabars[id].selectedTags = updatedTags;
  } else if (type === CLOSE_SEARCH_MODAL) {
    const { id } = payload;
    const { semasearches } = newState;
    semasearches[id].isSearchModalVisible = false;
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

    // suggestion=T, selected=F, isDirty=F, showTag=T
    const suggestionsToShow = suggestedTags.filter((suggestion) => {
      const tagObj = selectedTags.find(
        (tagDetails) => tagDetails[POSITIVE] === suggestion
          || tagDetails[NEGATIVE] === suggestion,
      );
      if (tagObj) {
        const isSelected = !!tagObj[SELECTED];
        const { isDirty } = tagObj;
        if (!isSelected && !isDirty) {
          return true;
        }
      }
      return false;
    });

    // suggestion=F, selected=T, isDirty=F, showTag=F
    selectedTags.forEach((tagObj) => {
      const isSelected = !!tagObj[SELECTED];
      if (isSelected) {
        const isSuggested = !!suggestedTags.find(
          (tag) => tag === tagObj[POSITIVE] || tag === tagObj[NEGATIVE],
        );
        const { isDirty } = tagObj;
        if (!isSuggested && !isDirty) {
          // eslint-disable-next-line no-param-reassign
          tagObj[SELECTED] = null;
        }
      }
    });

    const selectedTagsLength = selectedTags.filter((tagObj) => tagObj[SELECTED])
      .length;

    let numberOfAllowedSuggestions = SUGGESTED_TAG_LIMIT - selectedTagsLength;
    numberOfAllowedSuggestions = numberOfAllowedSuggestions < 0 ? 0 : numberOfAllowedSuggestions;

    // reverse so that only new suggestions are removed
    suggestionsToShow.reverse();

    while (suggestionsToShow.length > numberOfAllowedSuggestions) {
      suggestionsToShow.pop();
    }

    let updatedTags = [...selectedTags];
    suggestionsToShow.forEach((tag) => {
      const operation = { tag, op: ADD_OP };
      updatedTags = toggleTagSelection(operation, updatedTags);
      semabars[id].selectedTags = updatedTags;
    });
  } else if (type === TOGGLE_GLOBAL_SEARCH_MODAL) {
    const {
      data, position, isLoading = false, openFor,
    } = payload;
    const obj = {};
    if (data) {
      // open with data
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
      isSelectingEmoji: false,
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
    newState.githubMetadata.line_numbers = null;
  } else if (type === UPDATE_GITHUB_TEXTAREA) {
    const { isTyping } = payload;
    newState.github.isTyping = isTyping;
  } else if (type === UPDATE_SEMA_USER) {
    const { token, isLoggedIn } = payload;
    if (token) {
      const { user } = jwt_decode(token);
      newState.user = { ...user, ...{ isLoggedIn } };
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
  } else if (type === UPDATE_SEARCH_BAR_INPUT_VALUE) {
    const { id, searchValue } = payload;
    newState.semasearches[id].searchValue = searchValue;
  } else if (type === CLOSE_LOGIN_REMINDER) {
    newState.isReminderClosed = true;
  }
  return newState;
}

export default rootReducer;
