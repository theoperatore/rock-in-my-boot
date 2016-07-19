'use strict';

import { combineReducers } from 'redux';

import characters from './characters';
import badges from './badges';
import currentRoom from './currentRoom';
import mode from './mode';

export default combineReducers({
  characters,
  badges,
  currentRoom,
  mode,
})
