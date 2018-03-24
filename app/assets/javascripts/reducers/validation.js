import { INITIALIZE, SET_VALID, SET_INVALID, CHECK_SERVER } from "../constants";

const initialState = {
  validations: {},
  errorQueue: []
};

function __in__(needle, haystack) {
  return haystack.indexOf(needle) >= 0;
}

const setValidation = function (key, valid, message, changed = true, state) {
  const newState = { validations: { ...state.validations }, errorQueue: [...state.errorQueue] };
  if (!valid && changed && !(__in__(key, newState.errorQueue))) { // key is invalid
    newState.errorQueue.push(key);
  } else if (valid && __in__(key, newState.errorQueue)) {
    newState.errorQueue.splice(newState.errorQueue.indexOf(key), 1);
  }
  newState.validations[key] = {
    valid,
    changed,
    message
  };
  return newState;
};


export default function validation(state = initialState, action) {
  const { data } = action;

  switch (action.type) {
      case INITIALIZE: {
        if (!state.validations[data.key]) {
          return setValidation(data.key, false, data.message, false, state);
        }
        return state;
      }
      case SET_VALID: {
        return setValidation(data.key, true, null, true, state);
      }
      case SET_INVALID: {
        return setValidation(data.key, false, data.message, true, state);
      }
      case CHECK_SERVER: {
        return setValidation(data.key, !data.message, data.message, true, state);
      }
      default:
        return state;
    }
}
