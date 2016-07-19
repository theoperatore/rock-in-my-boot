'use strict';

import { combineReducers } from 'redux';

import characters from './characters';
import badges from './badges';
import roomGen from './room-gen';
import mode from './mode';

export default combineReducers({
  characters,
  badges,
  roomGen,
  mode,
})
