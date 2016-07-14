'use strict';

const express = require('express');
const IO = require('socket.io');
const debug = require('debug');

const wssLog = debug('rockin:wss');
const httpLog = debug('rockin:http');
const config = require('../config');

// prolly needs a rename?
const initializeGame = require('../lib/game');

const app = express();
const io = IO(config.WSS_PORT);
const rockin = initializeGame(io);

io.on('connection', socket => {
  let count = Object.keys(io.sockets.sockets).length;
  wssLog('client connected [ %s ] ( %s )', socket.id, count);

  rockin.syncClient(socket);
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
