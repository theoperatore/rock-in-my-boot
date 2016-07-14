'use strict';

const {
  CREATE_GROUP,
  JOIN_GROUP,
  START_ADVENTURE,
  CHARACTER_CHOSEN,
  SUBMIT_ACTION
} = require('./gameActionTypes');

module.exports = function initializeGame(io) {
  let connectedClients = {};

  function createGroup(data) {}
  function joinGroup(data) {}
  function startAdventure(data) {}
  function engageAction(data) {}

  function handleMessage(action) {
    switch (action.type) {
      case CREATE_GROUP:
      case JOIN_GROUP:
      case START_ADVENTURE:
      case CHARACTER_CHOSEN:
      case SUBMIT_ACTION:
      default:
        console.log(action);
    }
  }

  return {
    syncClient(socket) {
      if (!connectedClients[socket.id]) {
        connectedClients[socket.id] = socket;

        socket.emit('message', { type: 'CONNECTED' });
        socket.on('message', handleMessage);
        socket.on('disconnect', () => delete connectedClients[socket.id]);
      }
    },
  }
}
