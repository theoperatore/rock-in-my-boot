'use strict';

export const items = [
  {
    id: 'monkey-head',
    name: 'Dried Monkey Head',
    desc: 'A dried Monkey Head. Found under the couch of the shopkeeper. +1 to wow factor.',
    price: 500,
    size: 1,
    actionHandlers: {
      'default' (dispatch, getState, action) {},
    }
  },
  {
    id: 'french-press',
    name: 'French Press style Coffee Maker',
    desc: 'Makes coffee. Beans not included. Hot water also not included.',
    price: 1200,
    size: 2,
    actionHandlers: {
      'default' (dispatch, getState, action) {},
    }
  },
  {
    id: 'skeleton-key',
    name: 'Skeleton Key',
    desc: 'Might open one locked thing. Turns out, most locks require just a plain old skeleton key.',
    price: 10,
    size: 1,
    actionHandlers: {
      'default' (dispatch, getState, action) {},
    }
  }
];



export const roomsDefs = [
  {
    id: 'shop',
    name: 'Shop',
    desc: 'A simple shop with a old salty shopkeeper',
    npcId: 'guy-1',
    items: [
      'monkey-head',
      'french-press',
      'skeleton-key',
    ],
    roomActions: [
      {
        id: 'buy',
        name: 'Buy',
      },
      {
        id: 'talk',
        name: 'Talk',
      }
    ],
    actionHandlers: {
      'default' (dispatch, getState, action) {},
      'talk' (dispatch, getState, action) {},
      'buy' (dispatch, getState, action) {},
      'steal' (dispatch, getState, action) {},
      'punch' (dispatch, getState, action) {},
      'truthZone' (dispatch, getState, action) {},
      'blink' (dispatch, getState, action) {},
    }
  },
  {
    id: 'corpse-in-dungeon',
    name: 'A corpse blocks your path.',
    desc: '',
    roomActions: [
      {
        id: 'investigate-corpse',
        name: 'Investigate the corpse',
      },
      {
        id: 'ignore',
        name: 'Ignore',
      }
    ],
    actionHandlers: {
      'default' (dispatch, getState, action) {},
      'investigate-corpse' (dispatch, getState, action) {},
      'ignore' (dispatch, getState, action) {},
      'steal' (dispatch, getState, action) {},
      'punch' (dispatch, getState, action) {},
      'truthZone' (dispatch, getState, action) {},
      'blink' (dispatch, getState, action) {},
    },
  },
  {
    id: 'meet-a-person',
    name: 'Meet a fellow adventurer',
    desc: '',
    roomActions: [
      {
        id: 'talk-to-person',
        name: 'Talk to the person',
      }
    ],
    actionHandlers: {
      'default' (dispatch, getState, action) {},
      'talk-to-person' (dispatch, getState, action) {},
      'steal' (dispatch, getState, action) {},
      'punch' (dispatch, getState, action) {},
      'truthZone' (dispatch, getState, action) {},
      'blink' (dispatch, getState, action) {},
    },
  },
  {
    id: 'struggle-with-mutated-slime',
    name: 'Struggle against the Mutated Slime!',
    desc: '',
    roomActions: [
      {
        id: 'harvest-slime',
        name: 'Harvest Slime juice',
        condition (dispatch, getState, action) {}
      }
    ],
    actionHandlers: {
      'default' (dispatch, getState, action) {},
      'harvest-slime' (dispatch, getState, action) {},
      'steal' (dispatch, getState, action) {},
      'punch' (dispatch, getState, action) {},
      'truthZone' (dispatch, getState, action) {},
      'blink' (dispatch, getState, action) {},
    },
  }
]
