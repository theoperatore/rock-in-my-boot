'use strict';

const express = require('express');
const IO = require('socket.io');
const debug = require('debug');

const config = require('../config');
const wssLog = debug('rockin:wss');
const httpLog = debug('rockin:http');

const app = express();
const io = IO(config.WSS_PORT);

io.on('connection', socket => {
  wssLog('new client connected [ %s ] ( %s )', socket.id, Object.keys(io.sockets.sockets).length);
});

app.use('*', (req, res, next) => {
  httpLog(`[${req.method}] => ${req.originalUrl}`);
  next();
});

app.use(express.static(`${__dirname}/public`));

let server = app.listen(config.HTTP_PORT, () => {
  httpLog(`http server up on port ${config.HTTP_PORT}`);
});

exports.kill = function kill() {
  io.close();
  server.close();
}
