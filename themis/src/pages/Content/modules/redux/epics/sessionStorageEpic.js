import { ofType } from 'redux-observable';
import { ignoreElements, map, withLatestFrom } from 'rxjs/operators';
import { SEMA_REMINDER_SESSION_STORAGE_KEY } from '../../../constants';
import { CLOSE_LOGIN_REMINDER } from '../actionConstants';

const setsessionStorageEpic = (action$, state$) => action$.pipe(
  ofType(CLOSE_LOGIN_REMINDER),
  withLatestFrom(state$),
  // eslint-disable-next-line no-unused-vars
  map(([_, state]) => {
    const { isReminderClosed } = state;
    sessionStorage.setItem(SEMA_REMINDER_SESSION_STORAGE_KEY, isReminderClosed);
  }),
  ignoreElements(),
);

export default setsessionStorageEpic;
