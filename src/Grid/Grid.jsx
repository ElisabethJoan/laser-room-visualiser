import { Component } from "react";

import Dot from "../Dot/Dot";
import "./Grid.css";

export default class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grid: [],
    };
  }

  componentDidMount() {
    const grid = getInitialGrid(this.props);
    this.setState({ grid });
  }

  componentDidUpdate(previousProps) {
    if (previousProps !== this.props) {
      const grid = getInitialGrid(this.props);
      this.setState({ grid });
    }
  }

  render() {
    const { grid } = this.state;

    return (
      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div className={`column ${rowIdx}`} key={rowIdx}>
              {row.map((col, colIdx) => {
                if (col.isYou && col.isNotMirror) {
                  return (
                    <Dot
                      key={colIdx}
                      row={col.row}
                      col={col.col}
                      isYou={col.isYou}
                      isGuard={col.isGuard}
                      isWall={col.isWall}
                      isNotMirror={col.isNotMirror}
                      isVisible={col.isVisible}
                      forwardedCallback={this.props.forwardedCallback}
                      function={this.props.function}
                    />
                  );
                } else {
                  return (
                    <Dot
                      key={colIdx}
                      row={col.row}
                      col={col.col}
                      isYou={col.isYou}
                      isGuard={col.isGuard}
                      isWall={col.isWall}
                      isNotMirror={col.isNotMirror}
                      isVisible={col.isVisible}
                      function={this.props.function}
                    />
                  );
                }
              })}
            </div>
          );    
        })}
      </div>
    );
  }
}

const getInitialGrid = (state) => {
  const grid = [];
  
  let len1 = state.dimensions[0][state.dimensions[0].length - 1]
  let len2 = state.dimensions[1][state.dimensions[1].length - 1]

  if (len1 === undefined) {
    len1 = state.dimensions[0]
    len2 = state.dimensions[1]
  }

  for (let row = 0; row <= len1; row++) {
    const currentRow = [];
    for (let col = 0; col <= len2; col++) {
      currentRow.push(createDot(row, col, state.dimensions, state.myMirrors, state.guardMirrors, state.checked));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createDot = (col, row, dimensions, you, guard, mirrorsOn) => {
  let flag = false;
  let isMirror
  if (dimensions[0].length > 2) {
    flag = true
    let realDimensions = [dimensions[0][Math.ceil((dimensions[0].length / 2) - 1)], dimensions[1][Math.ceil((dimensions[1].length  / 2) - 1)],
                      dimensions[0][Math.ceil(dimensions[0].length / 2)], dimensions[1][Math.ceil(dimensions[1].length / 2)]]
    isMirror = (col >= realDimensions[0] && col <= realDimensions[2]) && (row >= realDimensions[1] && row <= realDimensions[3])
  }

  return {
    col,
    row,
    isYou: you[0].includes(col) && you[1].includes(row),
    isGuard: guard[0].includes(col) && guard[1].includes(row),
    isWall: col === 0 || row === 0 || dimensions[0].includes(col) || dimensions[1].includes(row),
    isNotMirror: flag ? isMirror : true,
    isVisible: mirrorsOn ? true : isMirror
  };
};
