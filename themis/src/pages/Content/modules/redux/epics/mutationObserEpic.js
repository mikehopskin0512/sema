import { ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { ignoreElements, map, mergeMap } from 'rxjs/operators';
// eslint-disable-next-line import/no-cycle
import { mutationObserverEvent } from '../action';
// eslint-disable-next-line import/no-cycle
import {
  ADD_MUTATION_OBSERVER,
  MUTATION_OBSERVER_EVENT,
  REMOVE_MUTATION_OBSERVER,
} from '../actionConstants';

const addMutationObserverEpic = (action$, state$, { observerHandler }) => action$.pipe(
  ofType(ADD_MUTATION_OBSERVER),
  mergeMap((action) => new Observable((subscriber) => {
    const { payload } = action;
    observerHandler.observe(payload, (mutationPayload) => {
      subscriber.next(mutationObserverEvent(mutationPayload));
    });
  })),
);

const removeMutationObserverEpic = (action$, state$, { observerHandler }) => action$.pipe(
  ofType(REMOVE_MUTATION_OBSERVER),
  map(() => {
    observerHandler.disconnect();
  }),
  ignoreElements(),
);

const mutationObserverEventEpic = (action$) => action$.pipe(
  ofType(MUTATION_OBSERVER_EVENT),
  map((action) => {
    const { payload: { mutations, onMutationEvent } } = action;
    onMutationEvent(mutations);
  }),
  ignoreElements(),
);

export { addMutationObserverEpic, removeMutationObserverEpic, mutationObserverEventEpic };
