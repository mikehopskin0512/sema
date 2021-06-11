import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import * as reducers from './features';
import { setAxiosInterceptor } from './utils/api';

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
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware)),
  );
  
  setAxiosInterceptor(store);
  return store;
};
