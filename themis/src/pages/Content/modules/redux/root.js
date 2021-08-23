import { combineEpics } from 'redux-observable';

// eslint-disable-next-line import/no-cycle
import submitButtonEpic from './epics/submitButtonEpic';
// eslint-disable-next-line import/no-cycle
import { addMutationObserverEpic, removeMutationObserverEpic, mutationObserverEventEpic } from './epics/mutationObserEpic';

// eslint-disable-next-line import/prefer-default-export
export const rootEpic = combineEpics(
  submitButtonEpic,
  addMutationObserverEpic,
  removeMutationObserverEpic,
  mutationObserverEventEpic,
);
