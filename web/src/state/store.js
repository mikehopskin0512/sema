import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import * as reducers from './features';
import { setAxiosInterceptor } from './utils/api';

const ADD_REDUX_LOGGER = process.env.ADD_REDUX_LOGGER || false;

const middleware = [thunk];

if (ADD_REDUX_LOGGER === true) {
  const { createLogger } = require('redux-logger');
  const logger = createLogger({
    collapsed: true,
  });

  middleware.push(logger);
}


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
