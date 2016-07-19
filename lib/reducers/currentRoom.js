'use strict';

import {
  ROOM_GENERATED,
} from '../gameActionTypes';

export default function currentRoom(state = null, action) {
  switch (action.type) {
  case ROOM_GENERATED:
      return action.room;
  default:
    return state;
  }
}
