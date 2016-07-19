'use strict';

// client => server actions
export const INITIALIZE = 'INITIALIZE';
export const CURRENT_STATE = 'CURRENT_STATE';
export const CREATE_GROUP = 'CREATE_GROUP';
export const JOIN_GROUP = 'JOIN_GROUP';
export const CHARACTER_CHOSEN = 'CHARACTER_CHOSEN';
export const SUBMIT_ACTION = 'SUBMIT_ACTION';
export const CHARACTER_NEGATE = 'CHARACTER_NEGATE';

// server => client actions
export const CLIENT_CONNECTED = 'CLIENT_CONNECTED';

// game lifecycle
export const MODE_CHANGE = 'MODE_CHANGE';
export const CHARACTER_SELECT_MODE = 'CHARACTER_SELECT_MODE';
export const GENERATE_ROOMS_MODE = 'GENERATE_ROOMS_MODE';
export const ENTER_ROOM_MODE = 'ENTER_ROOM_MODE';
export const RESOLVE_ROOM_MODE = 'RESOLVE_ROOM_MODE';
export const MOVING_TO_NEXT_ROOM_MODE = 'MOVING_TO_NEXT_ROOM_MODE';
export const END_GAME_MODE = 'END_GAME_MODE';

// other actions
export const BADGE_GET = 'BADGE_GET';
