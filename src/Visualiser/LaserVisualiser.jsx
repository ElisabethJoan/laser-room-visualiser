import { Component } from "react";
import { Line } from "react-lineto";

import "./LaserVisualiser.css";

export default class LaserVisualiser extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { straight, reflections, checked, topOffset, leftOffset } = this.props;

    if (checked) {
      return (
        <div className="LaserVisualiser">
          {straight.map((line, idx) => {
            if (line.length > 2) {
              return (
                <div key={`straight-line-parent-${idx}`}>
                  <Line key={`${idx}-solid`} x0={leftOffset + ((line[0][0] - 1) * 50)}
                    y0={topOffset + ((line[0][1] - 1) * 50)}
                    x1={leftOffset + ((line[1][0] - 1) * 50)}
                    y1={topOffset + ((line[1][1] - 1) * 50)} 
                    zIndex={-1} />
                  <Line key={`${idx}-dashed`} x0={leftOffset + ((line[1][0] - 1) * 50)}
                    y0={topOffset + ((line[1][1] - 1) * 50)}
                    x1={leftOffset + ((line[2][0] - 1) * 50)}
                    y1={topOffset + ((line[2][1] - 1) * 50)} 
                    borderStyle="dashed" zIndex={-1} />
                </div>
              );
            } else {
              return (
                <Line key={`${idx}-solo-solid`} x0={leftOffset + ((line[0][0] - 1) * 50)}
                  y0={topOffset + ((line[0][1] - 1) * 50)}
                  x1={leftOffset + ((line[1][0] - 1) * 50)}
                  y1={topOffset + ((line[1][1] - 1) * 50)}
                  zIndex={-1} />
              );
            }
          })}
        </div>
      );
    } else {
      return (
        <div className="LaserVisualiser">
          {reflections.map((coordinates) => {
            return (
                coordinates.map((coordinate, innerIdx) => {
                  return (
                    <Line key={innerIdx} x0={leftOffset + ((coordinate[0][0] - 1) * 50)} 
                      y0={topOffset + ((coordinate[0][1] - 1) * 50)} 
                      x1={leftOffset + ((coordinate[1][0] - 1) * 50)} 
                      y1={topOffset + ((coordinate[1][1] - 1) * 50)} 
                      zIndex={-1} />
                  );
                })
            );
          })}
        </div>
      );
    }
  }
}
