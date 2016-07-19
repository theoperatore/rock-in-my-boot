'use strict';

import debug from 'debug';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import combinedReducers from './reducers';

import {
  CURRENT_STATE,
  MODE_CHANGE,
  CHARACTER_SELECT_MODE,
  ENTER_ROOM_MODE,
} from './gameActionTypes';

import {
  createGenerateRooms,
} from './actions/rooms';

const log = debug('rockin:messages');

export default function initializeGame(externalEmit) {
  let store = createStore(combinedReducers, applyMiddleware(reduxThunk));

  function emit(action) {
    log('outbound: %o', action);
    externalEmit(action);
  }

  function generateClientState(getState) {
    const state = getState();

    const room = state.roomGen.room
      ? { ...state.roomGen.room }
      : null;

    // Do not send functions to the client.
    if (room) delete room.actionHandlers;

    const sentState = {
      badges: state.badges,
      characters: state.characters,
      room,
      mode: state.mode,
      type: CURRENT_STATE
    }

    return sentState;
  }

  function updateLifecycle(action) {
    return (dispatch, getState) => {

      // dispatch the action from the client
      dispatch(action);

      // ...then figure out where we should be lifecycle-wise
      const updatedState = getState();

      // TODO: this should be in the characters reducer.
      const everyCharacterSelectedOrNegated = updatedState
        .characters
        .every(c => c.selectedBy !== null || c.negated);

      log('lifecycle: everyCharacterSelectedOrNegated? %o',
        everyCharacterSelectedOrNegated)

      if (
        updatedState.mode === CHARACTER_SELECT_MODE
        && everyCharacterSelectedOrNegated
      ) {
        // generate first room, change mode
        dispatch(createGenerateRooms());

        // only the lifecycle thunk can cause mode changes?
        dispatch({
          type: MODE_CHANGE,
          mode: ENTER_ROOM_MODE,
        });
      }
    }
  }

  return function handleMessage(action) {
    let { uid } = action;
    log('[ %s ] incoming: %o', uid, action);

    // any special actions should be handled here
    switch (action.type) {
    case CURRENT_STATE:
      return emit(generateClientState(store.getState));
    }

    store.dispatch(updateLifecycle(action));
    emit(generateClientState(store.getState));
  }
}
