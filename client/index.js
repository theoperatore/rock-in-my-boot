import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';

console.log('le go');

const socket = io.connect(getSocketUrl());

socket.on('message', data => console.log('data', data));
socket.on('connect', data => console.log('connect', data));
socket.on('connect_error', err => console.error(err));
socket.on('connect_timeout', err => console.error(err));


ReactDOM.render(<p>hello</p>, document.body.querySelector('#root'));

function getSocketUrl() {
  let [ protocol, url ] = document.location.origin.split(':');
  return `${protocol}:${url}:${process.env.WSS_PORT}`;
}
