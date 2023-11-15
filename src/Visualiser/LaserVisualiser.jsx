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
    const { angdist, reflections, checked, topOffset, leftOffset } = this.props;

    if (checked) {
      return (
        <div className="LaserVisualiser">
          {Object.keys(angdist).map(function(key, idx) {
            return (
              <Line key={idx} x0={leftOffset} 
                y0={topOffset} 
                x1={leftOffset + (angdist[key] * -50) * Math.cos(key)} 
                y1={topOffset + (angdist[key] * -50) * Math.sin(key)} 
                zIndex={-1} />
            )}
          )}
        </div>
      );
    } else {
      return (
        <div className="LaserVisualiser">
          {reflections.map((coordinates, outerIdx) => {
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
