import React from 'react';
import ReactDOM from 'react-dom';

export default class Adventure extends React.Component {

  render () {
    const {
      uid,
      name,
      desc,
      character,
      classActions,
      onActionSelect,
    } = this.props;

    // TODO: make the button click actually a press-and-hold action,
    // like Destiny: a bar appears and fills while holding before the
    // action is initiated.

    return (
      <div>
        <h1>{name}</h1>
        <p>{desc}</p>

        {
          classActions.map(action => (
            <div>
              <button
                onClick={e => onActionSelect(action.id)}
              >{ action.name }</button>
            </div>
          ))
        }
      </div>
    )
  }
}
