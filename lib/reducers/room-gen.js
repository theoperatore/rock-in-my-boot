'use strict';

import {
  ROOMS_GENERATED,
  ROOM_RESOLVED,
  NEXT_ROOM,
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

  case ROOM_RESOLVED: {
    return {
      ...state,
      message: action.message,
    }
  }

  case NEXT_ROOM: {
    const currentIdx = state.rooms.findIndex(room => state.room === room);
    const next = state.rooms[currentIdx + 1] || null;
    return {
      ...state,
      room: next,
    }
  }

  default:
    return state;
  }
}
