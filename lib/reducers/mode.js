'use strict';

import {
  ROOMS_GENERATED,
  ROOM_RESOLVED,
  NEXT_ROOM,
} from '../actions/rooms';

import {
  MODE_CHANGE,
  CHARACTER_SELECT_MODE,
  RESOLVE_ROOM_MODE,
  ENTER_ROOM_MODE,
} from '../gameActionTypes';

export default function mode(state = CHARACTER_SELECT_MODE, action) {
  switch (action.type) {

  case MODE_CHANGE:
    return action.mode;

  case ROOMS_GENERATED:
  case NEXT_ROOM:
    return ENTER_ROOM_MODE;

  case ROOM_RESOLVED:
    return RESOLVE_ROOM_MODE;

  default:
    return state;
  }
}
