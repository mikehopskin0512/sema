import { combineReducers } from 'redux';

import auth from './auth/reducers';

const appReducer = combineReducers({
  auth,
});

const rootReducer = (state, action) => {
  let newState = state;

  // If logout, clear entire state tree
  if (action.type === 'AUTH_LOGOUT_SUCCESS') {
    newState = undefined;
  }

  return appReducer(newState, action);
};

export default rootReducer;
