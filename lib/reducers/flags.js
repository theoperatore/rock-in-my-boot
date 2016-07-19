import {
  FLAGS_INCREMENT,
} from '../actions/flags';

export default function badges(state = {}, action) {
  switch (action.type) {

  case FLAGS_INCREMENT:
    return {
      ...state,
      [action.key]: state[action.key] + action.value,
    };

  default:
    return state;
  }
}
