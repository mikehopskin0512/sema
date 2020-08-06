import * as types from './types';

const initialState = {
  showAlert: false,
  alertLabel: '',
  alertType: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.TRIGGER_ALERT:
    return {
      showAlert: true,
      alertLabel: action.alertLabel,
      alertType: action.alertType || 'success',
    };
  case types.CLEAR_ALERT:
    return {
      showAlert: false,
      alertLabel: '',
    };
  default:
    return state;
  }
};

export default reducer;
