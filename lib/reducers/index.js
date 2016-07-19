'use strict';

import { combineReducers } from 'redux';

import characters from './characters';
import badges from './badges';
import roomGen from './room-gen';
import mode from './mode';
import flags from './flags';
//import users from './users';

export default combineReducers({
  characters,
  badges,
  roomGen,
  mode,
  flags,
  //users,
})
