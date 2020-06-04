import * as types from './types';

const initialState = {
  showAlert: false,
  alertLabel: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.TRIGGER_ALERT:
    return {
      showAlert: true,
      alertLabel: action.alertLabel,
    };
  case types.CLEAR_ALERT:
    return {
      showAlert: false,
    };
  default:
    return state;
  }
};

export default reducer;
