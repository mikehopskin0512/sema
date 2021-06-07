import {
  ADD_SEMA_COMPONENTS,
  TOGGLE_TAG_MODAL,
  CLOSE_ALL_MODALS,
  UPDATE_SELECTED_EMOJI,
  UPDATE_SELECTED_TAGS,
  CLOSE_SEARCH_MODAL,
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
  TOGGLE_IS_SELECTING_EMOJI,
} from './actionConstants';

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

export const updateSelectedTagsWithSuggestion = (payload) => ({
  type: UPDATE_SELECTED_TAG_WITH_SUGGESTION,
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

export const updateSemaUser = (payload) => ({
  type: UPDATE_SEMA_USER,
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

export const updatetSearchBarInputValue = (payload) => ({
  type: UPDATE_SEARCH_BAR_INPUT_VALUE,
  payload,
});

export const toggleIsSelectingEmoji = (payload) => ({
  type: TOGGLE_IS_SELECTING_EMOJI,
  payload,
});
