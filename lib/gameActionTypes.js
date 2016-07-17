'use strict';

// client => server actions
export const INITIALIZE = 'INITIALIZE';
export const CURRENT_STATE = 'CURRENT_STATE';
export const CREATE_GROUP = 'CREATE_GROUP';
export const JOIN_GROUP = 'JOIN_GROUP';
export const CHARACTER_CHOSEN = 'CHARACTER_CHOSEN';
export const START_ADVENTURE = 'START_ADVENTURE';
export const SUBMIT_ACTION = 'SUBMIT_ACTION';
export const CHARACTER_NEGATE = 'CHARACTER_NEGATE';

// server => client actions
export const CLIENT_CONNECTED = 'CLIENT_CONNECTED';
export const CHARACTER_SELECT_STATE = 'CHARACTER_SELECT_STATE';
export const ADVENTURE_STATE = 'ADVENTURE_STATE';
