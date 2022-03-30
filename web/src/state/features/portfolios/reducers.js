import * as types from './types';

const initialState = {
  isFetching: false,
  data: {
    portfolio: {

    },
    portfolios: [],
  },
  error: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.REQUEST_FETCH_PORTFOLIO:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_PORTFOLIO_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        portfolio: action.portfolio,
      },
    };
  case types.REQUEST_FETCH_PORTFOLIO_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_FETCH_USER_PORTFOLIO:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_FETCH_USER_PORTFOLIO_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        portfolios: action.portfolios,
      },
    };
  case types.REQUEST_FETCH_USER_PORTFOLIO_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_UPDATE_PORTFOLIO:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_UPDATE_PORTFOLIO_SUCCESS: {
    const { portfolios } = state.data;
    const { portfolio } = action;
    const index = portfolios.findIndex((s) => s._id === portfolio._id);
    portfolios.splice(index, 1, portfolio);
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        portfolios,
      },
    };
  }
  case types.REQUEST_UPDATE_PORTFOLIO_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_UPDATE_SNAPSHOT:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_UPDATE_SNAPSHOT_SUCCESS: {
    const { portfolios } = state.data;
    const [portfolio, ...rest] = portfolios;
    const snapshot = { ...action.snapshot };
    portfolio.snapshots = portfolio.snapshots.map((s) => {
      if (s.id._id === snapshot._id) {
        return { id: snapshot, sort: s.sort };
      }
      return s;
    });
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        portfolios: [portfolio, ...rest],
      },
    };
  }
  case types.REQUEST_UPDATE_SNAPSHOT_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_REMOVE_SNAPSHOT:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_REMOVE_SNAPSHOT_SUCCESS: {
    const { portfolios } = state.data;
    portfolios[0] = action.portfolio;
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        portfolios,
      },
    };
  }
  case types.REQUEST_REMOVE_SNAPSHOT_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_REMOVE_PORTFOLIO:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_REMOVE_PORTFOLIO_SUCCESS: {
    const { portfolios } = state.data;
    const newPortfolios = portfolios.filter(portfolio => portfolio._id !== action.portfolioId);
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        portfolio: {},
        portfolios: newPortfolios,
      },
    };
  }
  case types.REQUEST_REMOVE_PORTFOLIO_ERROR:
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
