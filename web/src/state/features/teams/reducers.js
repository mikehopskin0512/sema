import * as types from './types';

const initialState = {
  teams: [],
  members: [],
  membersCount: 0,
  repos: [],
  metrics: undefined,
  isFetching: false,
  teamCollections: [],
  smartComments: [],
  summary: {},
  overview: {},
  invalidEmails: [],
  fetchedTeams: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_FETCH_TEAMS_OF_USER:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_TEAMS_OF_USER_SUCCESS:
    return {
      ...state,
      isFetching: false,
      teams: [...action.teams],
      fetchedTeams: true,
    };
  case types.REQUEST_FETCH_TEAMS_OF_USER_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.CREATE_NEW_TEAM:
    return {
      ...state,
      isFetching: true,
    };
  case types.CREATE_NEW_TEAM_SUCCESS:
    return {
      ...state,
      isFetching: false,
      error: {},
    };
  case types.CREATE_NEW_TEAM_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_FETCH_TEAM_MEMBERS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_TEAM_MEMBERS_SUCCESS:
    return {
      ...state,
      members: action.members,
      membersCount: action.membersCount ? action.membersCount : 0,
      isFetching: false,
      error: {},
    };
  case types.REQUEST_FETCH_TEAM_MEMBERS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_FETCH_TEAM_METRICS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_TEAM_METRICS_SUCCESS:
    return {
      ...state,
      metrics: action.metrics,
      isFetching: false,
      error: {},
    };
  case types.REQUEST_FETCH_TEAM_METRICS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_FETCH_TEAM_REPOS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_TEAM_REPOS_SUCCESS:
    return {
      ...state,
      repos: action.repos,
      isFetching: false,
      error: {},
    };
  case types.REQUEST_FETCH_TEAM_REPOS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_EDIT_TEAM:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_EDIT_TEAM_SUCCESS:
    return {
      ...state,
      isFetching: false,
      error: {},
    };
  case types.REQUEST_EDIT_TEAM_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.FETCH_TEAM_COLLECTIONS:
    return {
      ...state,
      isFetching: true,
    };
  case types.FETCH_TEAM_COLLECTIONS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      teamCollections: action.collections,
    };
  case types.FETCH_TEAM_COLLECTIONS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
    case types.REQUEST_FETCH_TEAM_SMART_COMMENT_SUMMARY:
    return {
      ...state,
      isFetching: true,
    }
  case types.REQUEST_FETCH_TEAM_SMART_COMMENT_SUMMARY_SUCCESS:
    return {
      ...state,
      summary: action.summary,
      smartComments: action.summary.smartComments,
      isFetching: false,
    }
  case types.REQUEST_FETCH_TEAM_SMART_COMMENT_SUMMARY_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.error
    }
  case types.REQUEST_FETCH_TEAM_SMART_COMMENT_OVERVIEW:
    return {
      ...state,
      isFetching: true,
    }
  case types.REQUEST_FETCH_TEAM_SMART_COMMENT_OVERVIEW_SUCCESS:
    return {
      ...state,
      overview: action.overview,
      isFetching: false,
    }
  case types.REQUEST_FETCH_TEAM_SMART_COMMENT_OVERVIEW_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.error
    }
  case types.REQUEST_INVITATION_EMAIL_VALIDATION_ERROR:
    return {
      ...state,
      isFetching: false,
      invalidEmails: []
    }
  case types.REQUEST_INVITATION_EMAIL_VALIDATION_SUCCESS:
    return {
      ...state,
      isFetching: false,
      invalidEmails: action.invalidEmails || []
    }
  default:
    return state;
  }
};

export default reducer;
