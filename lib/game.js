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
  END_GAME_MODE,
  SUBMIT_ACTION,
} from './gameActionTypes';

import {
  createGenerateRooms,
} from './actions/rooms';

import {
  gameModeMachine,
} from './redux-middlewares/game-mode-machine';

const log = debug('rockin:messages');

export default function initializeGame(externalEmit) {
  let store = createStore(combinedReducers, applyMiddleware(reduxThunk, gameModeMachine));

  store.subscribe(() => {
    emit(mapToClientState(store.getState()));
    //updateLifecycle(store.dispatch, store.getState);
  });

  // This is a huge hack right now, because we don't have a consistent
  // way of changing game modes without a subscribe callback firing.
  // Even if we used a dispatch(updateLifecycle()) esque approach, the previous
  // dispatch could cause a state change that results in an "intermediate
  // mode", such as ENTER_ROOM_MODE but we're out of rooms and the
  // END_GAME_MODE hasn't been set yet.
  //const emit = (function () {
  //  const msLimit = 100;
  //  let id = null;
  //  return function emit(action) {
  //    if (id) clearTimeout(id);
  //    id = setTimeout(() => {
  //      log('outbound: %o', action);
  //      externalEmit(action);
  //    }, msLimit);
  //  }
  //}());

  function emit (action) {
    log('outbound: %o', action);
    externalEmit(action);
  }

  function mapToClientState(state) {
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

  function updateLifecycle(dispatch, getState) {
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
  }

  return function handleMessage(action) {
    let { uid } = action;
    log('[ %s ] incoming: %o', uid, action);

    // any special actions should be handled here
    switch (action.type) {

    case SUBMIT_ACTION: {
      const state = store.getState();
      const actionHandler = state.roomGen.room.actionHandlers[action.id];
      actionHandler(store.dispatch, store.getState, action);
      return;
    }

    // I'd like to get rid of this eventually, it's only here because
    // "logging in" makes no actual state changes.
    case CURRENT_STATE: {
      emit(mapToClientState(store.getState()));
      return;
    }

    default: {
      store.dispatch(action);
    }
    }
  }
}
