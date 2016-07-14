'use strict';

const log = require('debug')('rocking:messages');
const {
  CLIENT_CONNECTED,
  CREATE_GROUP,
  JOIN_GROUP,
  START_ADVENTURE,
  CHARACTER_CHOSEN,
  SUBMIT_ACTION,
  CHARACTER_SELECT_STATE,
  ADVENTURE_STATE,
} = require('./gameActionTypes');

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

module.exports = function initializeGame(io) {
  let connectedClients = {};

  function handleCharacterChosen(uid, action) {
    let selectedIdx = appState.characters.findIndex(ch => ch.id === action.id);
    appState.characters = [
      ...appState.characters.slice(0, selectedIdx),
      Object.assign({}, appState.characters[selectedIdx], { selectedBy: uid }),
      ...appState.characters.slice(selectedIdx + 1)
    ];

    let remaining = appState.characters.filter(ch => ch.selectedBy === null && !ch.negated);
    if (remaining.length === 0) {
      io.emit('message', { type: ADVENTURE_STATE, adventure: 'MAXIMUM' });
    } else {
      io.emit('message', Object.assign({ type: CHARACTER_SELECT_STATE }, appState));
    }
  }

  function handleCharacterNegate(uid, action) {
    let selectedIdx = appState.characters.findIndex(ch => ch.id === action.id);
    appState.characters = [
      ...appState.characters.slice(0, selectedIdx),
      Object.assign({}, appState.characters[selectedIdx], { selectedBy: null, negated: true }),
      ...appState.characters.slice(selectedIdx + 1)
    ];

    let remaining = appState.characters.filter(ch => ch.selectedBy === null && !ch.negated);
    if (remaining.length === 0) {
      io.emit('message', { type: ADVENTURE_STATE, adventure: 'MAXIMUM' });
    } else {
      io.emit('message', Object.assign({ type: CHARACTER_SELECT_STATE }, appState));
    }
  }

  function handleMessage(socket, action) {
    log('received action: %o', action);
    switch (action.type) {
      case CHARACTER_CHOSEN:
        handleCharacterChosen(socket.id, action);
        break;
      case CHARACTER_NEGATE:
        handleCharacterNegate(socket.id, action);
        break;
      case SUBMIT_ACTION:
        break;
    }
  }

  return {
    syncClient(socket) {
      if (!connectedClients[socket.id]) {
        connectedClients[socket.id] = socket;
      }

      let action = Object.assign({
        type: CHARACTER_SELECT_STATE,
      }, appState);

      socket.emit('message', action);
      socket.on('message', handleMessage.bind(this, socket));
      socket.on('disconnect', () => delete connectedClients[socket.id]);
    },
  }
}
