import {
  ADD_SEMA_COMPONENTS,
  TOGGLE_TAG_MODAL,
  CLOSE_ALL_MODALS,
  UPDATE_SELECTED_EMOJI,
  UPDATE_SELECTED_TAGS,
  CLOSE_SEARCH_MODAL,
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
  ADD_MUTATION_OBSERVER,
  REMOVE_MUTATION_OBSERVER,
  UPDATE_SEARCH_BAR_INPUT_VALUE,
  TOGGLE_IS_SELECTING_EMOJI,
  CLOSE_ALL_SELECTING_EMOJI,
  CLOSE_LOGIN_REMINDER,
  MUTATION_OBSERVER_EVENT,
  LAST_USED_SMART_COMMENT,
  TOGGLE_SNIPPET_FOR_SAVE,
  CHANGE_SNIPPET_COMMENT,
  REMOVE_NOTIFICATION,
  ADD_NOTIFICATION,
  UPDATE_PROFILE,
  UPDATE_ORGANIZATIONS,
  FETCH_CURRENT_USER,
  FETCH_CURRENT_USER_SUCCESS,
  FETCH_CURRENT_USER_ERROR,
  UPDATE_CURRENT_USER,
} from './actionConstants';

export const removeNotification = (payload) => ({
  type: REMOVE_NOTIFICATION,
  payload,
});

export const addNotification = (payload) => ({
  type: ADD_NOTIFICATION,
  payload,
});

export const updateProfile = (payload) => ({
  type: UPDATE_PROFILE,
  payload,
});

export const updateOrganizations = (payload) => ({
  type: UPDATE_ORGANIZATIONS,
  payload,
});

export const changeSnippetComment = (payload) => ({
  type: CHANGE_SNIPPET_COMMENT,
  payload,
});

export const toggleSnippetForSave = (payload) => ({
  type: TOGGLE_SNIPPET_FOR_SAVE,
  payload,
});

export const addSemaComponents = (payload) => ({
  type: ADD_SEMA_COMPONENTS,
  payload,
});

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

export const closeSearchModal = (payload) => ({
  type: CLOSE_SEARCH_MODAL,
  payload,
});

export const toggleSearchModal = (payload) => ({
  type: TOGGLE_SEARCH_MODAL,
  payload,
});

export const addSuggestedTags = (payload) => ({
  type: ADD_SUGGESTED_TAGS,
  payload,
});

export const toggleGlobalSearchModal = (payload) => ({
  type: TOGGLE_GLOBAL_SEARCH_MODAL,
  payload,
});

export const toggleGlobalSearchLoading = (payload) => ({
  type: TOGGLE_GLOBAL_SEARCH_LOADING,
  payload,
});

export const onGlobalSearchInputChange = (payload) => ({
  type: ON_INPUT_GLOBAL_SEARCH,
  payload,
});
export const resetSemaStates = (payload) => ({
  type: RESET_SEMA_STATES,
  payload,
});

export const updateTextareaState = (payload) => ({
  type: UPDATE_GITHUB_TEXTAREA,
  payload,
});

export const addSuggestedComments = (payload) => ({
  type: ADD_SUGGESTED_COMMENTS,
  payload,
});

export const addGithubMetada = (payload) => ({
  type: ADD_GITHUB_METADATA,
  payload,
});

export const addSmartComment = (payload) => ({
  type: ADD_SMART_COMMENT,
  payload,
});

export const addMutationObserver = (payload) => ({
  type: ADD_MUTATION_OBSERVER,
  payload,
});

export const removeMutationObserver = () => ({
  type: REMOVE_MUTATION_OBSERVER,
});

export const mutationObserverEvent = (payload) => ({
  type: MUTATION_OBSERVER_EVENT,
  payload,
});

export const updateSearchBarInputValue = (payload) => ({
  type: UPDATE_SEARCH_BAR_INPUT_VALUE,
  payload,
});

export const toggleIsSelectingEmoji = (payload) => ({
  type: TOGGLE_IS_SELECTING_EMOJI,
  payload,
});

export const closeAllEmojiSelection = () => ({
  type: CLOSE_ALL_SELECTING_EMOJI,
});

export const closeLoginReminder = () => ({
  type: CLOSE_LOGIN_REMINDER,
});

export const usedSmartComment = (payload) => ({
  type: LAST_USED_SMART_COMMENT,
  payload,
});

export const fetchCurrentUserRequest = () => ({
  type: FETCH_CURRENT_USER,
});

export const fetchCurrentUserSuccess = (payload) => ({
  type: FETCH_CURRENT_USER_SUCCESS,
  payload,
});

export const fetchCurrentUserError = (error) => ({
  type: FETCH_CURRENT_USER_ERROR,
  error,
});

export const updateCurrentUser = (payload) => ({
  type: UPDATE_CURRENT_USER,
  payload,
});
