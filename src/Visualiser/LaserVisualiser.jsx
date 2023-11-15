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
    const { angdist, reflections, checked } = this.props;
    if (reflections === undefined) {
      return (
        <div className="LaserVisualiser">
          loading...
        </div>
      )
    }
    if (checked) {
      return (
        <div className="LaserVisualiser">
          {Object.keys(angdist).map(function(key, idx) {
            return (
              <Line key={idx} x0={525} y0={465} x1={525 + (angdist[key] * -50) * Math.cos(key)} y1={465 + (angdist[key] * -50) * Math.sin(key)} />
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
                    <Line key={innerIdx} x0={474 + (coordinate[0][0] * 50)} y0={414 + (coordinate[0][1] * 50)} x1={474 + (coordinate[1][0] * 50)} y1={414 + (coordinate[1][1] * 50)} />
                  );
                })
            );
          })}
        </div>
      );
    }
  }
}

          //{Object.keys(reflections).map(function(key, idx) {
            //return (
              //<Line key={idx} x0={474 + (reflections[idx][0][0] * 50)} y0={325 + (reflections[idx][0][1] * 50)} x1={474 + (reflections[idx][1][0] * 50)} y1={325 + (reflections[idx][1][1] * 50)} />
            //)}
          //)}
