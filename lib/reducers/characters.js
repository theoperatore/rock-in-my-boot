'use strict';

import {
  CHARACTER_CHOSEN,
  CHARACTER_NEGATE,
} from '../gameActionTypes';

const DEFAULT_CHARACTERS = [
  {
    id: 'mage',
    name: 'Mage',
    selectedBy: null,
    negated: false,
    ability: {
      id: 'blink',
      name: 'Blink'
    },
  },
  {
    id: 'fighter',
    name: 'Fighter',
    selectedBy: null,
    negated: false,
    ability: {
      id: 'punch',
      name: 'Punch'
    }
  },
  {
    id: 'rogue',
    name: 'Rogue',
    selectedBy: null,
    negated: false,
    ability: {
      id: 'steal',
      name: 'Steal'
    }
  },
  {
    id: 'cleric',
    name: 'Cleric',
    selectedBy: null,
    negated: false,
    ability: {
      id: 'truthZone',
      name: 'Zone of Truth',
    }
  },
];

export function characters(state = DEFAULT_CHARACTERS, action) {
  switch (action.type) {
    
  case CHARACTER_CHOSEN:
    let prevCharacterIdx = state.findIndex(ch => ch.selectedBy === action.uid);
    let nextState = state.slice();

    // remove player associated with other character
    if (prevCharacterIdx !== -1) {
       nextState = [
        ...state.slice(0, prevCharacterIdx),
        Object.assign({}, state[prevCharacterIdx], { selectedBy: null }),
        ...state.slice(prevCharacterIdx + 1)
      ];
    }

    // associate with new character
    let selectedIdx = nextState.findIndex(ch => ch.id === action.id);
    return [
      ...nextState.slice(0, selectedIdx),
      Object.assign({}, nextState[selectedIdx], { selectedBy: uid }),
      ...nextState.slice(selectedIdx + 1)
    ];

  case CHARACTER_NEGATE:
    let selectedIdx = state.findIndex(ch => ch.id === action.id);

    // cannot negate an already assigned player;
    // only negate a not selected player
    if (state[selectedIdx].selectedBy === null) {
      return [
        ...state.slice(0, selectedIdx),
        Object.assign({}, state[selectedIdx], { negated: !state[selectedIdx].negated }),
        ...state.slice(selectedIdx + 1)
      ];
    }

    return state;

  default:
    return state;
  }
}
