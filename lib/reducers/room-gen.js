'use strict';

import {
  ROOMS_GENERATED,
} from '../actions/rooms';

const INITIAL_STATE = { rooms: [], room: null };

export default function roomGen (state = INITIAL_STATE, action) {
  switch (action.type) {

  case ROOMS_GENERATED: {
    return {
      rooms: action.rooms,
      room: action.rooms[0],
    }
  }

  default:
    return state;
  }
}
