'use strict';

import express from 'express';
import IO from 'socket.io';
import debug from 'debug';

import config from '../config';
import initializeGame from '../lib/game';

const wssLog = debug('rockin:wss');
const httpLog = debug('rockin:http');

const app = express();
const io = IO(config.WSS_PORT);

// create one per websocket room?
const roomSocketHandler = initializeGame(action => io.emit('message', action));

function handleClientInitialize(action) {
  let uid = action.uid;
  if (!uid) {
    uid = Math.random().toString(36);
  }

  return uid;
}

io.on('connection', socket => {
  let count = Object.keys(io.sockets.sockets).length;
  wssLog('client connected [ %s ] ( %s )', socket.id, count);

  socket.on('message', action => {
    if (action.type === 'USER_LOGIN') {
      let uid = handleClientInitialize(action);

      socket.emit('message', {
        type: 'USER_LOGIN_SUCCESS',
        uid
      });
      return;
    }

    roomSocketHandler(action);
  });

  socket.on('disconnect', () => {
    let count = Object.keys(io.sockets.sockets).length;
    wssLog('client disconnect [ %s ] ( %s )', socket.id, count);
  });
});

app.use('*', (req, res, next) => {
  httpLog(`[${req.method}] => ${req.originalUrl}`);
  next();
});

app.use(express.static(`${__dirname}/../public`));

let server = app.listen(config.HTTP_PORT, () => {
  httpLog(`http server up on port ${config.HTTP_PORT}`);
});

export default function kill() {
  io.close();
  server.close();
}
