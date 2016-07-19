'use strict';

import debug from 'debug';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import combinedReducers from './reducers';

import {
  CURRENT_STATE,
  ROOM_GENERATED,
  MODE_CHANGE,
  CHARACTER_SELECT_MODE,
  ENTER_ROOM_MODE,
} from './gameActionTypes';

const log = debug('rockin:messages');

export default function initializeGame(externalEmit) {
  let store = createStore(combinedReducers, applyMiddleware(reduxThunk));

  function emit(action) {
    log('outbound: %o', action);
    externalEmit(action);
  }

  function generateClientState(getState) {
    let currentState = getState();
    let sentState = Object.assign({}, {
      currentRoom: currentState.currentRoom ?
      {
        type: currentState.currentRoom.type,
        id: currentState.currentRoom.id,
        name: currentState.currentRoom.name,
        desc: currentState.currentRoom.desc,
        classActions: currentState.currentRoom.classActions,
      }
      : null,
      characters: currentState.characters,
      mode: currentState.mode,
    });

    return Object.assign({ type: CURRENT_STATE }, sentState);
  }

  function generateRoom() {
    return (dispatch, getState) => {
      // assume simple-room is chosen to be generated;
      let generateSimpleRoom = require('./rooms/simple-room').generateRoom;
      let room = generateSimpleRoom(getState);

      dispatch({
        type: ROOM_GENERATED,
        room,
      });
    }
  }

  function updateLifecycle(action) {
    return (dispatch, getState) => {

      // dispatch the action from the client
      dispatch(action);

      // ...then figure out where we should be lifecycle-wise
      let updatedState = getState();
      if (updatedState.mode === CHARACTER_SELECT_MODE &&
          updatedState.characters.every(c => c.selectedBy !== null || c.negated))
      {
        dispatch(generateRoom());

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
