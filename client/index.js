import io from 'socket.io-client';
import React from 'react';
import ReactDOM from 'react-dom';
import CharacterSelect from './components/character-chooser';
import Adventure from './components/adventure';

const socket = io.connect(getSocketUrl());
const emit = socket.emit.bind(socket);
const mountNode = document.body.querySelector('#root');

socket.on('message', data => {
  let uid = sessionStorage.getItem('__rock_in_my_boot_id__');
  switch (data.type) {

  case 'CHARACTER_SELECT_STATE':
    ReactDOM.render(<CharacterSelect
      uid={uid}
      characters={data.characters}
      onCharacterSelect={id => createCharacterSelect(emit, id)}
      onCharacterNegate={id => createCharacterNegate(emit, id)}
      />, mountNode);
    break;

  case 'ADVENTURE_STATE':
    ReactDOM.render(<Adventure
      uid={uid}
      character={data.characters.find(chr => chr.selectedBy === uid)}
      onActionSelect={id => createActionSubmit(emit, id)}
      />, mountNode);
    break;

  }
});

socket.on('connect', handleConnect);
socket.on('initialize', handleInitialize);
socket.on('connect_error', err => console.error(err));
socket.on('connect_timeout', err => console.error(err));

function handleConnect() {
  console.log('connect');
  let uid = sessionStorage.getItem('__rock_in_my_boot_id__');
  emit('message', {
    type: 'INITIALIZE',
    uid,
  });
}

function handleInitialize(data) {
  console.log('initialized with uid', data);
  sessionStorage.setItem('__rock_in_my_boot_id__', data.uid);
  getCurrentState();
}

function getSocketUrl() {
  let [ protocol, url ] = document.location.origin.split(':');
  return `${protocol}:${url}:${process.env.WSS_PORT}`;
}

function getCurrentState() {
  emit('message', {
    type: 'CURRENT_STATE',
  });
}

function createCharacterSelect(emit, id) {
  let uid = sessionStorage.getItem('__rock_in_my_boot_id__');
  emit('message', {
    type: 'CHARACTER_CHOSEN',
    id,
    uid,
  });
}

function createCharacterNegate(emit, id) {
  let uid = sessionStorage.getItem('__rock_in_my_boot_id__');
  emit('message', {
    type: 'CHARACTER_NEGATE',
    id,
    uid,
  });
}

function createActionSubmit(emit, id) {
  let uid = sessionStorage.getItem('__rock_in_my_boot_id__');
  emit('message', {
    type: 'SUBMIT_ACTION',
    id,
    uid,
  });
}
