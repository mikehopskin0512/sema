import { createEpicMiddleware } from 'redux-observable';
import MutationObserverHandler from '../mutationObserver/MutationObserverHandler';

const observerHandler = new MutationObserverHandler();

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    observerHandler,
  },
});
export default epicMiddleware;
