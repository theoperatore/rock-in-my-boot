'use strict';

import debug from 'debug';
import { createStore } from 'redux';
import combinedReducers from './reducers';

import {
  CURRENT_STATE,
  ROOM_GENERATED,
  MODE_CHANGE,
  CHARACTER_SELECT_MODE,
  ENTER_ROOM_MODE,
} from './gameActionTypes';

const log = debug('rockin:messages');

let appState = {
  mode: CHARACTER_SELECT_MODE,
  currentRoom: null,
};

export default function initializeGame(externalEmit) {

  let store = createStore(combinedReducers);

  function emit(action) {
    log('outbound: %o', action);
    externalEmit(action);
  }

  function generateClientState() {
    let currentState = store.getState();
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

    // assume simple-room is chosen to be generated;
    let generateSimpleRoom = require('./rooms/simple-room').generateRoom;
    let room = generateSimpleRoom(store.getState);

    store.dispatch({
      type: ROOM_GENERATED,
      room,
    });
  }

  return function handleMessage(action) {
    let { uid } = action;
    log('[ %s ] incoming: %o', uid, action);

    switch (action.type) {
    case CURRENT_STATE:
      return emit(generateClientState());
      break;
    default:
      store.dispatch(action);
    }

    let updatedState = store.getState();
    if (updatedState.mode === CHARACTER_SELECT_MODE &&
        updatedState.characters.every(c => c.selectedBy !== null || c.negated))
    {
      store.dispatch({
        type: MODE_CHANGE,
        mode: ENTER_ROOM_MODE,
      });
    }

    emit(generateClientState());
  }
}
