import React, {Component} from 'react';

import './Dot.css';

export default class Dot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      row,
      col,
      isYou,
      isGuard,
      isWall,
      isMirror,
    } = this.props;

    const type = isYou
      ? 'you' : isGuard
      ? 'guard' : isWall
      ? 'wall' : 'blank';

    return (
        <div
          id={`col-${col}`}
          className={`dot ${type}`}>
        </div>
    );
  }
}