'use strict';

function generateClassActions(currentClasses, state) {
  return currentClasses.reduce((classObj, name) => {
    let actions = [];

    actions.push({
      id: 'talk-1',
      name: 'Talk'
    },
    {
      id: 'run-1',
      name: 'Run'
    });

    switch (name) {
    case 'mage':
      actions.push({
        id: 'blink',
        name: 'Blink',
        classAction: true,
      });
      break;
    case 'fighter':
      actions.push({
        id: 'punch',
        name: 'Punch',
        classAction: true,
      })
      break;
    case 'cleric':
      actions.push({
        id: 'truthZone',
        name: 'Zone of Truth',
        classAction: true,
      })
      break;
    case 'rogue':
      actions.push({
        id: 'steal',
        name: 'Steal',
        classAction: true,
      })
      break;
    }

    classObj[name] = actions;
    return classObj;
  }, {});
}

export function generateSimpleRoom(state) {
  let currentClasses = state.characters
    .map(c => c.id);

  return {
    type: 'simple-room',
    id: 'simple-room-1',
    name: 'A simple test room',
    desc: 'Like I said, a simple test room',
    classActions: generateClassActions(currentClasses, state),
    actionHandlers: {
      'default' (dispatch, getState, action) {},
      'talk-1' (dispatch, getState, action) {
        let talkedToNobodyCount = getState().flags['talked_to_nobody'];

        dispatch({
          type: 'ROOM_RESOLVED',
          message: talkedToNobodyCount > 3
            ? 'Again, like the times before, there is no one around to hear your words.'
            : 'Who are you talking to? There is no one around to hear your words.',
        })

        dispatch({
          type: 'FLAGS_INCREMENT',
          key: 'talked-to-nobody',
          value: 1,
        })
      },
      'run-1' (dispatch, getState, action) {
        dispatch({
          type: 'ROOM_RESOLVED',
          message:  'You left the room....quickly.',
        });
      },
      'steal' (dispatch, getState, action) {
        dispatch({
          type: 'ROOM_RESOLVED',
          message:  'You get nothing...because the room is empty. You actually lost some Rogue Points.',
          partyMessage: 'The Rogue tried to steal from an empty room. Silly silly Rogue.',
        });

        dispatch({
          type: 'BADGE_GET',
          id: 'bad-rogue'
        });
      },
      'punch' (dispatch, getState, action) {
        dispatch({
          type: 'ROOM_RESOLVED',
          message:  'You punch the air with enthusiasm. Man, I wouldn\'t want to be on the receiving end of that!',
        });
      },
      'truthZone' (dispatch, getState, action) {
        dispatch({
          type: 'ROOM_RESOLVED',
          message:  'The room\'s secrets are revealed to you! It\'s sad about being empty!',
        });
      },
      'blink' (dispatch, getState, action) {
        dispatch({
          type: 'ROOM_RESOLVED',
          message:  'You teleport about 10 feet away from your current location. Impressive!',
        });

        dispatch({
          type: 'BADGE_GET',
          id: 'show-off'
        });
      },
    }
  }
}
