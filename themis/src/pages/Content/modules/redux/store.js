import { createStore, applyMiddleware } from 'redux';
// TODO: good if we can break cyclic dependencies
// eslint-disable-next-line import/no-cycle
import rootReducer from './reducer';

import observerMiddleware from './middleware/observer';
import epicMiddleware from './middleware/epicMiddleware';
// eslint-disable-next-line import/no-cycle
import { rootEpic } from './root';

const middlewares = [observerMiddleware, epicMiddleware];

const store = createStore(rootReducer, applyMiddleware(...middlewares));

epicMiddleware.run(rootEpic);

export default store;
