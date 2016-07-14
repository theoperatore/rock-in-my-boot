import React from 'react';
import ReactDOM from 'react-dom';

export default class CharacterChooser extends React.Component {

  render () {
    const {
      uid,
      characters,
      onCharacterSelect,
      onCharacterNegate,
    } = this.props;
    return (
      <div>
        <h1>Choose Your Character</h1>
        {
          characters.map(c => (
            <div>
              <button
                disabled={c.selectedBy || c.negated}
                style={{
                  textDecoration: c.negated
                    ? 'line-through'
                    : 'none'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCharacterSelect(c.id);
                }}
              >
              { c.name }
              { c.selectedBy === uid && '(you)' }
              </button>
              <button
                disabled={c.selectedBy || c.negated}
                style={{
                  textDecoration: c.negated
                    ? 'line-through'
                    : 'none'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCharacterNegate(c.id);
                }}
              >
                X
              </button>
            </div>
          ))
        }
      </div>
    )
  }

}
