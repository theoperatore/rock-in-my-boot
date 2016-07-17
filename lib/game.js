'use strict';

import debug from 'debug';
import {
  CURRENT_STATE,
  CLIENT_CONNECTED,
  CREATE_GROUP,
  JOIN_GROUP,
  START_ADVENTURE,
  CHARACTER_CHOSEN,
  SUBMIT_ACTION,
  CHARACTER_SELECT_STATE,
  ADVENTURE_STATE,
  CHARACTER_NEGATE,
} from './gameActionTypes';

const log = debug('rockin:messages');

let appState = {
  mode: CHARACTER_SELECT_STATE,
  characters: [
    {
      id: 'mage',
      name: 'Mage',
      selectedBy: null,
      negated: false,
    },
    {
      id: 'fighter',
      name: 'Fighter',
      selectedBy: null,
      negated: false,
    },
    {
      id: 'rogue',
      name: 'Rogue',
      selectedBy: null,
      negated: false,
    },
    {
      id: 'inspector',
      name: 'Inspector',
      selectedBy: null,
      negated: false,
    },
  ]
};

export default function initializeGame(externalEmit) {

  function emit(action) {
    log('outbound: %o', action);
    externalEmit(action);
  }

  function sendCurrentState(uid, action) {
    // TODO: put type in app state; character select mode / adventure mode
    emit(Object.assign({ type: CURRENT_STATE }, appState));
  }

  function handleCharacterChosen(uid, action) {
    let prevCharacterIdx = appState.characters.findIndex(ch => ch.selectedBy === uid);

    // remove player associated with other character
    if (prevCharacterIdx !== -1) {
      appState.characters = [
        ...appState.characters.slice(0, prevCharacterIdx),
        Object.assign({}, appState.characters[prevCharacterIdx], { selectedBy: null }),
        ...appState.characters.slice(prevCharacterIdx + 1)
      ];
    }

    // associate with new character
    let selectedIdx = appState.characters.findIndex(ch => ch.id === action.id);
    appState.characters = [
      ...appState.characters.slice(0, selectedIdx),
      Object.assign({}, appState.characters[selectedIdx], { selectedBy: uid }),
      ...appState.characters.slice(selectedIdx + 1)
    ];

    let remaining = appState.characters.filter(ch => ch.selectedBy === null && !ch.negated);
    if (remaining.length === 0) {
      appState = Object.assign({}, appState, { mode: ADVENTURE_STATE });
    }

    sendCurrentState();
  }

  function handleCharacterNegate(uid, action) {
    let selectedIdx = appState.characters.findIndex(ch => ch.id === action.id);

    // cannot negate an already assigned player;
    // only negate a not selected player
    if (appState.characters[selectedIdx].selectedBy === null) {
      appState.characters = [
        ...appState.characters.slice(0, selectedIdx),
        Object.assign({}, appState.characters[selectedIdx], { negated: !appState.characters[selectedIdx].negated }),
        ...appState.characters.slice(selectedIdx + 1)
      ];
    }

    let remaining = appState.characters.filter(ch => ch.selectedBy === null && !ch.negated);
    if (remaining.length === 0) {
      appState = Object.assign({}, appState, { mode: ADVENTURE_STATE });
    }

    sendCurrentState();
  }

  return function handleMessage(action) {
    let { uid } = action;

    log('[ %s ] incoming: %o', uid, action);
    switch (action.type) {
      case CURRENT_STATE:
        sendCurrentState(uid, action);
        break;
      case CHARACTER_CHOSEN:
        handleCharacterChosen(uid, action);
        break;
      case CHARACTER_NEGATE:
        handleCharacterNegate(uid, action);
        break;
      case SUBMIT_ACTION:
        break;
    }
  }
}
