import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import CharacterSelect from './components/character-chooser';
import Adventure from './components/adventure';

const socket = io.connect(getSocketUrl());
const emit = socket.emit.bind(socket);
const mountNode = document.body.querySelector('#root');

socket.on('message', data => {
  switch (data.type) {

  case 'CHARACTER_SELECT_STATE':
    ReactDOM.render(<CharacterSelect
      uid={'/#' + socket.id}
      characters={data.characters}
      onCharacterSelect={id => createCharacterSelect(emit, id)}
      onCharacterNegate={id => createCharacterNegate(emit, id)}
      />, mountNode);
    break;

  case 'ADVENTURE_STATE':
    ReactDOM.render(<Adventure
      uid={'/#' + socket.id}
      character={data.characters.find(chr => chr.selectedBy === '/#' + socket.id)}
      onActionSelect={id => createActionSubmit(emit, id)}
      />, mountNode);
    break;

  }
});

socket.on('connect', data => console.log('connect', data));
socket.on('connect_error', err => console.error(err));
socket.on('connect_timeout', err => console.error(err));

function getSocketUrl() {
  let [ protocol, url ] = document.location.origin.split(':');
  return `${protocol}:${url}:${process.env.WSS_PORT}`;
}

function createCharacterSelect(emit, id) {
  emit('message', {
    type: 'CHARACTER_CHOSEN',
    id,
  });
}

function createCharacterNegate(emit, id) {
  emit('message', {
    type: 'CHARACTER_NEGATE',
    id,
  });
}

function createActionSubmit(emit, id) {
  emit('message', {
    type: 'SUBMIT_ACTION',
    id,
  });
}
