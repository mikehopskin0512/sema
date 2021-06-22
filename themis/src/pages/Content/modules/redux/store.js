import { createStore, applyMiddleware} from 'redux';
import rootReducer from './reducer';

import { observerMiddleware } from './middleware/observer';

const store = createStore(rootReducer, applyMiddleware(observerMiddleware));

export default store;
