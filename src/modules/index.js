import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducers';

// Only log in dev
if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({
    collapsed: true,
  });

  export const makeStore = (initialState, options) => {
      return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk, logger)));
  };
} else {
  export const makeStore = (initialState, options) => {
      return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk)));
  };

}
