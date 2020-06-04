import * as types from './types';

export const triggerAlert = (alertLabel) => ({
  type: types.TRIGGER_ALERT,
  alertLabel,
});

export const clearAlert = () => ({
  type: types.CLEAR_ALERT,
});
