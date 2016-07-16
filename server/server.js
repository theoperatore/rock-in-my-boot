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
const createMessageHandler = initializeGame(action => io.emit('message', action));

io.on('connection', socket => {
  let handler = createMessageHandler(socket.id);
  let count = Object.keys(io.sockets.sockets).length;
  wssLog('client connected [ %s ] ( %s )', socket.id, count);

  // figure out better way to do this?
  handler({ type: 'CURRENT_STATE' });

  socket.on('message', handler);
});

app.use('*', (req, res, next) => {
  httpLog(`[${req.method}] => ${req.originalUrl}`);
  next();
});

app.use(express.static(`${__dirname}/../public`));

let server = app.listen(config.HTTP_PORT, () => {
  httpLog(`http server up on port ${config.HTTP_PORT}`);
});

exports.kill = function kill() {
  io.close();
  server.close();
}
