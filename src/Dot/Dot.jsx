import { Component } from "react";

import "./Dot.css";

export default class Dot extends Component {
  constructor(props) {
    super(props);

    this.handleClick.bind(this);
  }

  handleClick = (row, col, type) => {
    if (type.includes("real") && type.includes("blank")) {
      this.props.function(row, col); 
    }
  }

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

    if (this.props.forwardedRef !== null) {
      return (
        <div
          id={`${col}-${row}`}
          className={`dot ${type}`}
          ref={this.props.forwardedCallback}
          onClick={() => this.handleClick(row, col, type)} >
        </div>
      );
    } else {
    return (
        <div
          id={`${col}-${row}`}
          className={`dot ${type}`}
          onClick={() => this.handleClick(row, col, type)} >
        </div>
      );
    }
  }
}
