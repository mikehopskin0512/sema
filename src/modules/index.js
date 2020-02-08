import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducers';

export let makeStore;

// Only log in dev
if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({
    collapsed: true,
  });

  makeStore = (initialState, options) => {
      return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk, logger)));
  };
} else {
  makeStore = (initialState, options) => {
      return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk)));
  };
}
