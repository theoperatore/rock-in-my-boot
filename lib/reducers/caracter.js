'use strict';

import {
  CHARACTER_CHOSEN,
  CHARACTER_NEGATE,
} from '../gameActionTypes';

export function characters(state, action) {
  switch (action.type) {
  case CHARACTER_CHOSEN:
  case CHARACTER_NEGATE:
  default:
    return state;
  }
}
