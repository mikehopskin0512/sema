import * as types from './types';
import { REQUEST_CREATE_SUGGEST_COMMENT_SUCCESS } from '../suggest-snippets/types';
import { PROFILE_VIEW_MODE } from '../../../utils/constants';

const initialState = {
  isFetching: false,
  isAuthenticated: false,
  token: null,
  user: {},
  userVoiceToken: null,
  selectedTeam: {},
  profileViewMode: PROFILE_VIEW_MODE.INDIVIDUAL_VIEW,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case REQUEST_CREATE_SUGGEST_COMMENT_SUCCESS: {
    const collections = state.user.collections.map((collection) => {
      if (action.collectionId !== collection.collectionData._id) {
        return collection;
      }
      return {
        ...collection,
        collectionData: {
          ...collection.collectionData,
          comments: [
            ...collection.collectionData.comments,
            action.suggestedComment,
          ],
        },
      };
    });
    return {
      ...state,
      user: {
        ...state.user,
        collections,
      },
    };
  }
  case types.AUTHENTICATE_REQUEST:
    return {
      ...state,
      isFetching: true,
    };
  case types.AUTHENTICATE:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: true,
      token: action.token,
      error: {},
    };
  case types.AUTHENTICATE_FAILURE:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false,
      token: null,
      error: action.errors,
    };
  case types.HYDRATE_USER:
    return {
      ...state,
      user: action.user,
      userVoiceToken: action.userVoiceToken,
    };
  case types.DEAUTHENTICATE:
    return {
      ...state,
      isAuthenticated: false,
      token: null,
      user: {},
      error: {},
    };
  case types.RECEIVE_REFRESH_TOKEN_SUCCESS:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: true,
      token: action.token,
      error: {},
    };
  case types.REQUEST_REGISTRATION_SUCCESS:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false, // Don't authenticate them until after verification
      token: action.token,
      user: action.user,
      error: {},
    };
  case types.REQUEST_REGISTRATION_ERROR:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false,
      error: action.errors,
    };
  case types.RECEIVE_REFRESH_TOKEN_ERROR:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false,
      error: action.errors,
    };
  case types.REQUEST_JOIN_ORG_SUCCESS:
    return {
      ...state,
      isFetching: false,
      token: action.token,
      user: action.user,
      error: {},
    };
  case types.REQUEST_JOIN_ORG_ERROR:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false,
      error: action.errors,
    };
  case types.VERIFY_USER_SUCCESS:
    return {
      ...state,
      isFetching: false,
      user: action.user,
      error: {},
    };
  case types.USER_NOT_VERIFIED:
    return {
      ...state,
      isFetching: false,
      isAuthenticated: false,
      user: action.user,
    };
  case types.SET_USER:
    return {
      ...state,
      user: action.user,
    };
  case types.REQUEST_UPDATE_USER_SUCCESS:
    return {
      ...state,
      isFetching: false,
      user: action.user,
      error: {},
    };
  case types.REQUEST_UPDATE_USER_ERROR:
    return {
      ...state,
      isFetching: false,
      user: {},
      error: action.errors,
    };
  case types.TOGGLE_USER_COLLECTION_ACTIVE:
    return {
      ...state,
      isFetching: true,
    };
  case types.TOGGLE_USER_COLLECTION_ACTIVE_SUCCESS:
    return {
      ...state,
      isFetching: false,
      user: action.user,
      error: {},
    };
  case types.TOGGLE_USER_COLLECTION_ACTIVE_ERROR:
    return {
      ...state,
      isFetching: false,
      // users: [],
      error: action.errors,
    };
  case types.FETCH_CURRENT_USER:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_CURRENT_USER_SUCCESS:
    return {
      ...state,
      isFetching: false,
      user: action.user,
      error: {},
    };
  case types.FETCH_CURRENT_USER_ERROR:
    return {
      ...state,
      isFetching: false,
      user: {},
      error: action.errors,
    };
  case types.SET_SELECTED_ORGANIZATION:
    return {
      ...state,
      selectedTeam: action.selectedTeam,
    };
  case types.SET_PROFILE_VIEW_MODE:
    return {
      ...state,
      profileViewMode: action.profileViewMode,
    };
  default:
    return state;
  }
};

export default reducer;
