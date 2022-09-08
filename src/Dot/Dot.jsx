import React, {Component} from 'react';

import './Dot.css';

export default class Dot extends Component {
  render() {
    const {
      row,
      col,
      isYou,
      isGuard,
      isWall,
      isNotMirror,
      isVisible,
    } = this.props;

    let type = isYou
      ? 'you' : isGuard
      ? 'guard' : isWall
      ? 'wall' : 'blank';

    if (!isNotMirror) {
      type = type + ' mirror'
    } else {
      type = type + ' real'
    }

    if (!isVisible) {
      type = 'blank';
    }
    
    return (
        <div
          id={`${col}-${row}`}
          className={`dot ${type}`}>
        </div>
    );
  }
}