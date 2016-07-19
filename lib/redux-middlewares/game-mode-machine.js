import debug from 'debug';

import {
  MODE_CHANGE,
  CHARACTER_SELECT_MODE,
  ENTER_ROOM_MODE,
  END_GAME_MODE,
  SUBMIT_ACTION,
} from '../gameActionTypes';

import {
  createGenerateRooms,
} from '../actions/rooms';


const log = debug('rockin:game-mode-machine');

export function gameModeMachine ({ dispatch, getState }) {
  return (next) => {
    return (action) => {

      log('next(action)', action && action.type);
      const returnVal = next(action);

      const state = getState();
      // ...then figure out where we should be lifecycle-wise

      // TODO: this should be in the characters reducer.
      const everyCharacterSelectedOrNegated = state
        .characters
        .every(c => c.selectedBy !== null || c.negated);

      if (
        state.mode === CHARACTER_SELECT_MODE
        && everyCharacterSelectedOrNegated
        && !state.roomGen.room
      ) {
        log('generating rooms');
        // generate first room, change mode
        dispatch(createGenerateRooms());
        return;
      }

      if (
        state.mode === CHARACTER_SELECT_MODE
        && everyCharacterSelectedOrNegated
        && state.roomGen.room
      ) {
        log('switching to first room');
        // only the lifecycle thunk can cause mode changes?
        dispatch({
          type: MODE_CHANGE,
          mode: ENTER_ROOM_MODE,
        });
        return;
      }

      if (
        state.mode === ENTER_ROOM_MODE
        && !state.roomGen.room
      ) {
        log('ending game');
        dispatch({
          type: MODE_CHANGE,
          mode: END_GAME_MODE,
        });

        return;
      }

      return returnVal;
    }
  }
}