import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import * as reducers from './features';

const middleware = [thunk];

// if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');
  const logger = createLogger({
    collapsed: true,
  });

  middleware.push(logger);
// }

export const initStore = (initialState = {}) => {
  const rootReducer = combineReducers(reducers);
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware)),
  );
};
