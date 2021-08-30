import {
  filter, ignoreElements, map, withLatestFrom,
} from 'rxjs/operators';
// eslint-disable-next-line import/no-cycle
import { checkSubmitButton } from '../../content-util';
import { UPDATE_SELECTED_EMOJI, UPDATE_SELECTED_TAGS } from '../actionConstants';

const submitButtonEpic = (action$, state$) => action$.pipe(
  filter((action) => {
    const { type } = action;
    return type === UPDATE_SELECTED_EMOJI || type === UPDATE_SELECTED_TAGS;
  }),
  withLatestFrom(state$),
  map(([action, state]) => {
    const { payload: { id } } = action;
    const { semabars } = state;
    checkSubmitButton(id, semabars[id]);
  }),
  ignoreElements(),
);

export default submitButtonEpic;
