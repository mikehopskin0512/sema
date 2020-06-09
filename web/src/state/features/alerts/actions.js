import * as types from './types';

export const triggerAlert = (alertLabel, alertType) => ({
  type: types.TRIGGER_ALERT,
  alertLabel,
  alertType,
});

export const clearAlert = () => ({
  type: types.CLEAR_ALERT,
});
