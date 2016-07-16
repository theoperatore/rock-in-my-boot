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

io.on('connection', socket => {
  let count = Object.keys(io.sockets.sockets).length;
  wssLog('client connected [ %s ] ( %s )', socket.id, count);

  // figure out better way to do this?
  roomSocketHandler.call(socket, ({ type: 'CURRENT_STATE' }));

  socket.on('message', roomSocketHandler);
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
