import { generateSimpleRoom } from '../rooms/simple-room';

export const ROOMS_GENERATED = 'ROOM_GENERATED';
export const ROOM_RESOLVED = 'ROOM_RESOLVED';
export const NEXT_ROOM = 'NEXT_ROOM';

export function createGenerateRooms () {
  return (dispatch, getState) => {
    // assume simple-room is chosen to be generated;
    const rooms = [ generateSimpleRoom(getState()) ];

    dispatch({
      type: ROOMS_GENERATED,
      rooms,
    });
  }
}