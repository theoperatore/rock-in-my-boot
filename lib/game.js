'use strict';

import debug from 'debug';
import {
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

export default function initializeGame(emit) {

  function handleSendCurrentState(uid, action) {
    // TODO: put type in app state; character select mode / adventure mode
    emit(Object.assign({ type: CHARACTER_SELECT_STATE }, appState));
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
      emit({ type: ADVENTURE_STATE, adventure: 'MAXIMUM' });
    } else {
      emit(Object.assign({ type: CHARACTER_SELECT_STATE }, appState));
    }
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
      emit({ type: ADVENTURE_STATE, adventure: 'MAXIMUM' });
    } else {
      emit(Object.assign({ type: CHARACTER_SELECT_STATE }, appState));
    }
  }

  return function handleMessage(action) {
    let { id: uid } = this;

    log('[ %s ] action: %o', uid, action);
    switch (action.type) {
      case 'CURRENT_STATE':
        handleSendCurrentState.call(this, uid, action);
        break;
      case CHARACTER_CHOSEN:
        handleCharacterChosen.call(this, uid, action);
        break;
      case CHARACTER_NEGATE:
        handleCharacterNegate.call(this, uid, action);
        break;
      case SUBMIT_ACTION:
        break;
    }
  }
}
