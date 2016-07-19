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

// TODO: rewrite this structure so instead of array indices and modifications
// of nested objects, it's a more simple map that differentiates between
// static and dynamic data:
// {
//   classes: [ ...static characters above ],
//   selected: { [classId]: userId, [classId]: NEGATED_CONST },
//   allSelected: true|false //maybe don't need this
// }

export default function characters(state = DEFAULT_CHARACTERS, action) {
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
    let chosenCharacterIdx = nextState.findIndex(ch => ch.id === action.id);
    return [
      ...nextState.slice(0, chosenCharacterIdx),
      Object.assign({}, nextState[chosenCharacterIdx], { selectedBy: action.uid }),
      ...nextState.slice(chosenCharacterIdx + 1)
    ];

  case CHARACTER_NEGATE:
    let negatedCharacterIdx = state.findIndex(ch => ch.id === action.id);

    // cannot negate an already assigned player;
    // only negate a not selected player
    if (state[negatedCharacterIdx].selectedBy === null) {
      return [
        ...state.slice(0, negatedCharacterIdx),
        Object.assign({}, state[negatedCharacterIdx], { negated: !state[negatedCharacterIdx].negated }),
        ...state.slice(negatedCharacterIdx + 1)
      ];
    }

    return state;

  default:
    return state;
  }
}
