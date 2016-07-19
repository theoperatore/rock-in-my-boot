'use strict';

import {
  MODE_CHANGE,
  CHARACTER_SELECT_MODE,
} from '../gameActionTypes';

export default function mode(state = CHARACTER_SELECT_MODE, action) {
  switch (action.type) {
  case MODE_CHANGE:
    return action.mode;
  default:
    return state;
  }
}
