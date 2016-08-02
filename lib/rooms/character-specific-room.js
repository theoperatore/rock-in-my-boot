
const TYPE = 'character-specific-room';
const BASE_COST = 5;

export function generateCharacterSpecificRoom (state) {

  const ROOM_ID = state.roomGen.rooms.reduce(
    (room, total) =>
      room.type === TYPE ? total + 1 : total, 0);

  const chosen = state.characters[ROOM_ID % state.characters.length];

  const classActions = {};
  const actionHandlers = {};

  state.characters.forEach(chr => {
    const actionId = chr.id + '-action-00';

    const cost = chr.id === chosen.id
      ? BASE_COST
      : state.characters.length + BASE_COST

    classActions[chr.id] = [{
      id: actionId,
      name: `Solve it! (${cost} points)`,
      classAction: true
    }];

    actionHandlers[actionId] = (dispatch, getState, action) => {

      const state = getState();
      const points = state.points[chr.id];

      if (points <= cost) {
        dispatch({
          type: 'POINTS_DECREMENT',
          id: chr.id,
          cost,
        });

        dispatch({
          type: 'ROOM_RESOLVED',
          message: `${chr.name} solved the room!`,
        });
      } else {
        dispatch({
          type: 'ROOM_INSUFFICIENT_POINTS',
          message: `${chr.name} is too tired!`,
        });
      }
    }

  })

  const room = {
    type: TYPE,
    id: 'character-specific-room-' + ROOM_ID,
    name: 'tailor made'.toUpperCase(),
    desc: 'blah blah, maybe this is better for a particular character',
    classActions,
    actionHandlers,
  }

  return room;
}