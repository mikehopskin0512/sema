import * as types from './types';

const initialState = {
  isFetching: false,
  data: {
    repository: {},
    repositories: [],
    reactions: [],
    tags: {},
    overview: {
      name: '',
      stats: {
        totalPullRequests: 0,
        totalSemaUsers: 0,
        totalSmartCommenters: 0,
        totalSmartComments: 0
      }
    },
    filterValues: {
      requesters: [],
      authors: [],
      pullRequests: [],
      repos: [],
    }
  },

};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_CREATE_REPO:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_CREATE_REPO_SUCCESS:
    return {
      ...state,
      isFetching: false,
      // data: upsert(state.data, action.source._id, action.source),
      error: {},
    };
  case types.REQUEST_CREATE_REPO_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
      },
      error: action.errors,
    };
  case types.REQUEST_FETCH_REPOS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_REPOS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        repositories: action.repositories,
        repository: state.data.repository,
      },
      error: {},
    };
  case types.REQUEST_FETCH_REPOS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_FETCH_REPO:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_REPO_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        repositories: state.data.repositories,
        repository: action.repository,
      },
      error: {},
    };
  case types.REQUEST_FETCH_REPO_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        repositories: state.data.repositories,
        repository: action.repository,
      },
      error: action.errors,
    };
  case types.REQUEST_GET_USER_REPOS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_GET_USER_REPOS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        repositories: action.repositories,
        repository: state.data.repository,
      },
      error: {},
    };
  case types.REQUEST_GET_USER_REPOS_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        repositories: action.repositories,
        repository: state.data.repository,
      },
      error: action.errors,
    };
  case types.REQUEST_FILTER_SEMA_REPOS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FILTER_SEMA_REPOS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        repositories: action.repositories,
        repository: state.data.repository,
      },
      error: {},
    };
  case types.REQUEST_FILTER_SEMA_REPOS_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        repositories: action.repositories,
        repository: state.data.repository,
      },
      error: action.errors,
    };
  case types.REQUEST_GET_REPO_REACTIONS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_GET_REPO_REACTIONS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        reactions: action.reactions,
      },
      error: {},
    };
  case types.REQUEST_GET_REPO_REACTIONS_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        reactions: [],
      },
      error: action.errors,
    };
  case types.REQUEST_GET_REPO_TAGS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_GET_REPO_TAGS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        tags: action.tags,
      },
      error: {},
    };
  case types.REQUEST_GET_REPO_TAGS_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        tags: [],
      },
      error: action.errors,
    };
  case types.REQUEST_FETCH_REPOSITORY_OVERVIEW:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_REPOSITORY_OVERVIEW_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        overview: action.overview,
      },
      error: {},
    };
  case types.REQUEST_FETCH_REPOSITORY_OVERVIEW_ERROR:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        overview: action.overview,
      },
      error: action.errors,
    };
  case types.REQUEST_FETCH_REPO_FILTERS:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_REPO_FILTERS_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        filterValues: {...state.data.filterValues, ...action.filters}
      },
      error: {},
    };
  case types.REQUEST_FETCH_REPO_FILTERS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_CLEAR_REPO_FILTERS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        filterValues: {
          requesters: [],
          authors: [],
          pullRequests: [],
          repos: [],
        }
      },
      error: {},
    };
  case types.REQUEST_FETCH_DASHBOARD_REPOSITORIES:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_DASHBOARD_REPOSITORIES_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        repositories: action.repositories,
      },
      error: {},
    };
  case types.REQUEST_FETCH_DASHBOARD_REPOSITORIES_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
      };
  default:
    return state;
  }
};

export default reducer;
