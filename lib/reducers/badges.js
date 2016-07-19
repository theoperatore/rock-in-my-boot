'use strict';

import {
  BADGE_GET,
} from '../gameActionTypes';

const DEFAULT_BADGES = [
  {
    id: 'bad-rogue',
    name: 'Bad Rogue',
    desc: 'Sorry, you just aren\'t making it as a Rogue. Perhaps a more academic role?',
    value: 0,
  },
  {
    id: 'show-off',
    name: 'Show Off',
    desc: 'Wow! That\'s some neat stuff you just did there!',
    value: 0,
  }
];

export default function badges(state = DEFAULT_BADGES, action) {
  switch (action.type) {

  case BADGE_GET:
    let badgeIdx = state.findIndex(b => b.id === action.id);

    return [
      ...state.slice(0, badgeIdx),
      Object.assign({}, state[badgeIdx], { value: state[badgeIdx].value + 1 }),
      ...state.slice(badgeIdx + 1),
    ];

  default:
    return state;
  }
}
