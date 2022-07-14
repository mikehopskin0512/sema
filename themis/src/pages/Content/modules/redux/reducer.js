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
  ADD_SUGGESTED_COMMENTS,
  ADD_GITHUB_METADATA,
  ADD_SMART_COMMENT,
  UPDATE_SEARCH_BAR_INPUT_VALUE,
  CLOSE_SEARCH_MODAL,
  TOGGLE_IS_SELECTING_EMOJI,
  CLOSE_ALL_SELECTING_EMOJI,
  CLOSE_LOGIN_REMINDER,
  LAST_USED_SMART_COMMENT,
  TOGGLE_SNIPPET_FOR_SAVE,
  CHANGE_SNIPPET_COMMENT,
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_PROFILE,
  UPDATE_ORGANIZATIONS,
  FETCH_CURRENT_USER,
  FETCH_CURRENT_USER_SUCCESS,
  FETCH_CURRENT_USER_ERROR,
  UPDATE_CURRENT_USER,
  CHANGE_IS_SNIPPET_SAVED,
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
  const { payload = {} } = action;

  switch (action.type) {
    case UPDATE_ORGANIZATIONS: {
      return {
        ...state,
        organizations: payload,
      };
    }
    case UPDATE_PROFILE: {
      return {
        ...state,
        selectedProfile: payload,
      };
    }
    case ADD_NOTIFICATION: {
      return {
        ...state,
        notifications: [...state.notifications, payload],
      };
    }
    case REMOVE_NOTIFICATION: {
      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification !== payload),
      };
    }
    case CHANGE_SNIPPET_COMMENT: {
      const { comment } = payload;
      return {
        ...state,
        snippetComment: comment,
      };
    }
    case TOGGLE_SNIPPET_FOR_SAVE: {
      const { semabarContainerId } = payload;
      const semaBar = state.semabars[semabarContainerId];
      return {
        ...state,
        semabars: {
          ...state.semabars,
          [semabarContainerId]: {
            ...semaBar,
            isSnippetForSave: !semaBar.isSnippetForSave,
          },
        },
      };
    }
    case ADD_SEMA_COMPONENTS: {
      const { activeElement } = payload;
      const { semabarContainerId, semaSearchContainerId } = getSemaIds(activeElement);
      const { initialTags, initialReaction } = getInitialSemaValues(
        activeElement,
      );
      const semaBar = {
        isTagModalVisible: false,
        isSelectingEmoji: false,
        selectedTags: initialTags,
        selectedReaction: initialReaction,
        isReactionDirty: false,
        suggestedTags: [],
        isSnippetForSave: false,
      };
      const semaSearch = {
        isSearchModalVisible: false,
        selectedSuggestedComments: [],
        searchValue: '',
      };
      return {
        ...state,
        semabars: {
          ...state.semabars,
          [semabarContainerId]: semaBar,
        },
        semasearches: {
          ...state.semasearches,
          [semaSearchContainerId]: semaSearch,
        },
      };
    }
    case TOGGLE_TAG_MODAL: {
      const { id } = payload;
      const semaBar = {
        ...state.semabars[id],
        isTagModalVisible: !state.semabars[id].isTagModalVisible,
      };
      return {
        ...state,
        semabars: {
          ...state.semabars,
          [id]: semaBar,
        },
      };
    }
    case TOGGLE_IS_SELECTING_EMOJI: {
      const { id } = payload;
      const semaBar = {
        ...state.semabars[id],
        isSelectingEmoji: !state.semabars[id].isSelectingEmoji,
      };
      return {
        ...state,
        semabars: {
          ...state.semabars,
          [id]: semaBar,
        },
      };
    }
    case ADD_SUGGESTED_COMMENTS: {
      const { id, suggestedComment } = payload;
      const semaSearch = {
        ...state.semasearches[id],
        selectedSuggestedComments: [
          ...state.semasearches[id].selectedSuggestedComments,
          suggestedComment,
        ],
      };
      return {
        ...state,
        semasearches: {
          ...state.semasearches,
          [id]: semaSearch,
        },
      };
    }
    case ADD_GITHUB_METADATA: {
      return {
        ...state,
        githubMetadata: payload,
      };
    }
    case ADD_SMART_COMMENT: {
      return {
        ...state,
        smartComment: payload,
      };
    }
    case UPDATE_SEARCH_BAR_INPUT_VALUE: {
      const { id, searchValue } = payload;
      const semaSearch = {
        ...state.semasearches[id],
        searchValue,
      };
      return {
        ...state,
        semasearches: {
          ...state.semasearches,
          [id]: semaSearch,
        },
      };
    }
    case CLOSE_LOGIN_REMINDER: {
      return {
        ...state,
        isReminderClosed: true,
      };
    }
    case CLOSE_ALL_MODALS: {
      const { semabars, semasearches } = state;
      const newSemaBars = { ...semabars };
      Object.keys(newSemaBars).forEach((id) => {
        newSemaBars[id].isTagModalVisible = false;
      });
      const newSemaSearches = { ...semasearches };
      Object.keys(newSemaSearches).forEach((id) => {
        newSemaSearches[id].isSearchModalVisible = false;
      });
      return {
        ...state,
        semabars: newSemaBars,
        semasearches: newSemaSearches,
        [GLOBAL_SEMA_SEARCH_ID]: {
          ...state[GLOBAL_SEMA_SEARCH_ID],
          isOpen: false,
        },
      };
    }
    case CLOSE_ALL_SELECTING_EMOJI: {
      const { semabars } = state;
      const newSemaBars = { ...semabars };
      Object.keys(newSemaBars).forEach((id) => {
        newSemaBars[id].isSelectingEmoji = false;
      });
      return {
        ...state,
        semabars: newSemaBars,
      };
    }
    case UPDATE_SELECTED_EMOJI: {
      const { id, selectedReaction, isReactionDirty = true } = payload;
      return {
        ...state,
        semabars: {
          ...state.semabars,
          [id]: {
            ...state.semabars[id],
            selectedReaction,
            isReactionDirty,
          },
        },
      };
    }
    case UPDATE_SELECTED_TAGS: {
      const { id, operation } = payload;
      const {
        semabars,
        semabars: {
          [id]: { selectedTags },
        },
      } = state;
      const updatedTags = toggleTagSelection(operation, selectedTags, true);
      return {
        ...state,
        semabars: {
          ...semabars,
          [id]: {
            ...semabars[id],
            selectedTags: updatedTags,
          },
        },
      };
    }
    case CLOSE_SEARCH_MODAL: {
      const { id } = payload;
      const { semasearches } = state;
      return {
        ...state,
        semasearches: {
          ...semasearches,
          [id]: {
            ...semasearches[id],
            isSearchModalVisible: false,
          },
        },
      };
    }
    case TOGGLE_SEARCH_MODAL: {
      const { id, isOpen } = payload;
      const { semasearches } = state;
      return {
        ...state,
        semasearches: {
          ...semasearches,
          [id]: {
            ...semasearches[id],
            isSearchModalVisible: isOpen || !semasearches[id].isSearchModalVisible,
          },
        },
      };
    }
    case ADD_SUGGESTED_TAGS: {
      const { id, suggestedTags } = payload;
      const {
        semabars,
        semabars: {
          [id]: { selectedTags = [] },
        },
      } = state;

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

      let updatedTags = [...selectedTags];
      // suggestion=F, selected=T, isDirty=F, showTag=F
      updatedTags.forEach((tagObj) => {
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

      const selectedTagsLength = updatedTags.filter((tagObj) => tagObj[SELECTED])
        .length;

      let numberOfAllowedSuggestions = SUGGESTED_TAG_LIMIT - selectedTagsLength;
      numberOfAllowedSuggestions = numberOfAllowedSuggestions < 0 ? 0 : numberOfAllowedSuggestions;

      // reverse so that only new suggestions are removed
      suggestionsToShow.reverse();

      while (suggestionsToShow.length > numberOfAllowedSuggestions) {
        suggestionsToShow.pop();
      }

      // TODO: i am not sure that it works right
      suggestionsToShow.forEach((tag) => {
        const operation = { tag, op: ADD_OP };
        updatedTags = toggleTagSelection(operation, updatedTags);
      });

      return {
        ...state,
        semabars: {
          ...semabars,
          [id]: {
            ...semabars[id],
            selectedTags: updatedTags,
          },
        },
      };
    }
    case LAST_USED_SMART_COMMENT: {
      return {
        ...state,
        lastUserSmartComment: payload,
      };
    }
    case TOGGLE_GLOBAL_SEARCH_MODAL: {
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
      return {
        ...state,
        [GLOBAL_SEMA_SEARCH_ID]: obj,
      };
    }
    case TOGGLE_GLOBAL_SEARCH_LOADING: {
      const { isLoading } = payload;
      return {
        ...state,
        [GLOBAL_SEMA_SEARCH_ID]: {
          ...state[GLOBAL_SEMA_SEARCH_ID],
          isLoading,
        },
      };
    }
    case ON_INPUT_GLOBAL_SEARCH: {
      const { data } = payload;
      return {
        ...state,
        [GLOBAL_SEMA_SEARCH_ID]: {
          ...state[GLOBAL_SEMA_SEARCH_ID],
          data,
        },
      };
    }
    case RESET_SEMA_STATES: {
      const { semabarContainerId, semaSearchContainerId } = payload;

      const semaBar = {
        ...state.semabars[semabarContainerId],
        isTagModalVisible: false,
        isSelectingEmoji: false,
        selectedTags: TAGS_INIT,
        selectedReaction: EMOJIS[0],
        isReactionDirty: false,
        suggestedTags: [],
      };

      const semaSearch = {
        ...state.semasearches[semaSearchContainerId],
        isSearchModalVisible: false,
        selectedSuggestedComments: [],
        searchValue: '',
      };
      return {
        ...state,
        semabars: {
          ...state.semabars,
          [semabarContainerId]: semaBar,
        },
        semasearches: {
          ...state.semasearches,
          [semaSearchContainerId]: semaSearch,
        },
        lastUserSmartComment: null,
        githubMetadata: {
          ...state.githubMetadata,
          filename: null,
          file_extension: null,
          line_numbers: null,
        },
      };
    }
    case UPDATE_GITHUB_TEXTAREA: {
      const { isTyping } = payload;
      return {
        ...state,
        github: {
          ...state.github,
          isTyping,
        },
      };
    }
    case FETCH_CURRENT_USER: {
      return {
        ...state,
        isFetching: true,
        user: { isLoggedIn: false },
      };
    }
    case FETCH_CURRENT_USER_SUCCESS: {
      const user = payload;
      return {
        ...state,
        isFetching: false,
        user,
        error: {},
      };
    }
    case FETCH_CURRENT_USER_ERROR: {
      const error = payload;
      return {
        ...state,
        isFetching: false,
        user: { isLoggedIn: false },
        error,
      };
    }
    case UPDATE_CURRENT_USER: {
      const { token, isLoggedIn } = payload;
      let user;
      if (token) {
        user = { ...state.user, isLoggedIn };
      } else {
        user = { isLoggedIn };
      }
      return {
        ...state,
        user,
      };
    }
    case CHANGE_IS_SNIPPET_SAVED: {
      return {
        ...state,
        snippetSaved: {
          ...action.payload,
        },
      }
    }
    default: {
      return state;
    }
  }
}

export default rootReducer;
