import { createStore, applyMiddleware } from 'redux';
// TODO: good if we can break cyclic dependencies
// eslint-disable-next-line import/no-cycle
import rootReducer from './reducer';

import { observerMiddleware } from './middleware/observer';

const store = createStore(rootReducer, applyMiddleware(observerMiddleware));

export default store;
