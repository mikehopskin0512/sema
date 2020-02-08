import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducers';

const logger = createLogger({
  collapsed: true,
});

export const makeStore = (initialState, options) => {
    return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk, logger)));
};
