import React, { Component } from "react";
import { Line } from 'react-lineto';
import Dot from "./Dot/Dot";

const YOU_DOT_ROW = 1;
const YOU_DOT_COL = 1;
const GUARD_DOT_ROW = 1;
const GUARD_DOT_COL = 2;
const DIMENSIONS = [3+1, 2+1];

export default class Grid extends Component {
  constructor(props) {
    super(props);
    
    // this.state = {
    //   grid: [],
    //   myMirrors: this.props.myMirrors,
    //   guardMirrors: this.props.guardMirrors,
    //   angdist: this.props.angdist,
    //   dimensions: this.props.dimensions
    // };
    this.state = {
      grid: [],
      myMirrors: [[YOU_DOT_COL], [YOU_DOT_ROW]],
      guardMirrors: [[GUARD_DOT_COL], [GUARD_DOT_ROW]],
      angdist: undefined,
      dimensions: DIMENSIONS
    };
  }

  componentDidMount() {
    const grid = getInitialGrid(this.state);
    this.setState({ grid });
    // this.setState({ 
    //   grid: [],
    //   myMirrors: [[YOU_DOT_COL], [YOU_DOT_ROW]],
    //   guardMirrors: [[GUARD_DOT_COL], [GUARD_DOT_ROW]],
    //   angdist: undefined,
    //   dimensions: DIMENSIONS
    //  });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.angdist !== this.state.angdist) {
      const grid = getInitialGrid(this.state);
      this.setState({ grid });
    }
    if (previousProps.myMirrors !== this.props.myMirrors && this.props.angdist !== undefined) {
      const grid = getInitialGrid(this.props);
      this.setState({ grid });
    }
  }

  render() {
    const { grid } = this.state;

    return (
      <div className="wrapper">
      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
              <div className="column">
                  {row.map((col, colIdx) => {
                    // console.log(col.row)
                      return (
                        <Dot
                          key={colIdx}
                          row={col.col}
                          col={col.row}
                          isYou={col.isYou}
                          isGuard={col.isGuard}
                          isWall={col.isWall}
                          isMirror={col.isMirrow}
                        />
                      );
                  })}
              </div>
            );    
        })}
        </div>
        {/* <div className="test">
          {Object.keys(angdist).map(function(key, idx) {
            return (
              <Line x0={158} y0={98} x1={158 + (angdist[key]*60) * Math.cos(key)} y1={98 + (angdist[key]*60) * Math.sin(key)} />
            )}
          )}
        </div> */}
      </div>
    );
  }
}

const getInitialGrid = (state) => {
  const grid = [];

  console.log(state)
  let len1 = state.dimensions[0][state.dimensions[0].length]
  let len2 = state.dimensions[1][state.dimensions[1].length]

  if (len1 === undefined) {
    len1 = state.dimensions[0]
    len2 = state.dimensions[1]
  }

  for (let row = 0; row < len1; row++) {
  // for (let row = 0; row < DIMENSIONS[0]; row++) {
    const currentRow = [];
    for (let col = 0; col < len2; col++) {
    // for (let col = 0; col < DIMENSIONS[1]; col++) {
      currentRow.push(createDot(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createDot = (col, row) => {
  return {
    col,
    row,
    isYou: row === YOU_DOT_ROW && col === YOU_DOT_COL,
    isGuard: row === GUARD_DOT_ROW && col === GUARD_DOT_COL,
    isWall: row === 0 || col === 0 || row === DIMENSIONS[1] - 1 || col === DIMENSIONS[0] - 1,
    isMirror: false,
  };
};
