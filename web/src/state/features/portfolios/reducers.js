import { updatePortfolioFieldById } from './helpers';
import * as types from './types';

const initialState = {
  isFetching: false,
  data: {
    portfolio: {},
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
  case types.REQUEST_UPDATE_PORTFOLIO_FIELD: {
    const { portfolioId, field, value } = action;
    const portfolios = [...state.data.portfolios];
    return {
      ...state,
      data: {
        ...state.data,
        portfolios: updatePortfolioFieldById(portfolios, portfolioId, field, value),
      },
      error: {},
    };
  }
  case types.REQUEST_UPDATE_PORTFOLIO_FIELD_ERROR: {
    const { portfolioId, field, initialValue, error } = action;
    const portfolios = [...state.data.portfolios];
    return {
      ...state,
      data: {
        ...state.data,
        portfolios: updatePortfolioFieldById(portfolios, portfolioId, field, initialValue),
      },
      error,
    };
  }
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
        portfolio,
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
    if (portfolios.length === 0) return { ...state, isFetching: false };
    const [portfolio, ...rest] = portfolios;
    if (!portfolio) return {...state, isFetching: false};
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
  case types.REQUEST_CREATE_PORTFOLIO_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_CREATE_PORTFOLIO:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_CREATE_PORTFOLIO_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        portfolio: action.portfolio,
        portfolios: [action.portfolio, ...state.data.portfolios],
      },
    };
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
    const { deletedSnapshots, portfolioId } = action;
    const updatedPortfolios = [...state.data.portfolios];
    const portfolio = updatedPortfolios.find(({ _id }) => _id === portfolioId);
    const filterDeletedSnapshots = ({ id: { _id } }) => !deletedSnapshots.includes(_id);
    portfolio.snapshots = portfolio.snapshots.filter(filterDeletedSnapshots);
    const isCurrentPortfolio = portfolio._id === state.data.portfolio._id;
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        portfolio: isCurrentPortfolio ? portfolio : state.data.portfolio,
        portfolios: updatedPortfolios,
      },
    };
  }
  case types.REQUEST_REMOVE_SNAPSHOT_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_POST_SNAPSHOT_TO_PORTFOLIO:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_POST_SNAPSHOT_TO_PORTFOLIO_SUCCESS:
    return {
      ...state,
      isFetching: false,
      // data: {
      //   ...state.data,
      //   portfolio: action.portfolio,
      // },
      //ToDo: Fix this after backend will be ready
    };
  case types.REQUEST_POST_SNAPSHOT_TO_PORTFOLIO_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.errors,
    };
  case types.REQUEST_PORTFOLIO_COPY:
    return {
      ...state,
      isFetching: true,
    };
  case types.REQUEST_PORTFOLIO_COPY_SUCCESS:
    return {
      ...state,
      isFetching: false,
      data: {
        ...state.data,
        portfolios: [...state.data.portfolios, action.portfolio],
      },
      error: {},
    };
  case types.REQUEST_PORTFOLIO_COPY_ERROR:
    return {
      ...state,
      isFetching: true,
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
