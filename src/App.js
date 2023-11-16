import { useState, useCallback } from "react";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";

import { mirrorCalculation, dimensionMirrorsCalculation, angleCalculation, 
  offsetCoordinates, calculateReflections, calculateStraightLines } from "./algorithm.js";

import LaserVisualiser from "./Visualiser/LaserVisualiser";
import Grid from "./Grid/Grid";
import "./App.css";

function App() {
  const [checked, setChecked] = useState(false);
  const [dimensions, setDimensions] = useState([3, 2]);
  const [origin, setOrigin] = useState([1, 1]);
  const [target, setTarget] = useState([2, 1]);
  const [distance, setDistance] = useState(4);
  const [offsetTop, setOffsetTop] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [offsetOffset, setOffsetOffset] = useState([0, 0]);
  const [moveOrigin, setMoveOrigin] = useState(false);

  const handleCheck = () => {
    setChecked(!checked);
  }

  const originMirrors = mirrorCalculation(dimensions, origin, distance);
  const targetMirrors = mirrorCalculation(dimensions, target, distance);
  const dimensionMirrors = dimensionMirrorsCalculation(originMirrors[0].length, dimensions);

  const angles = angleCalculation(origin, [originMirrors, targetMirrors], distance);
  const originOffsetMirrors = offsetCoordinates(originMirrors, dimensionMirrors);
  const targetOffsetMirrors = offsetCoordinates(targetMirrors, dimensionMirrors);

  let reflections = [];
  let lines = [];
  for (const [key, value] of Object.entries(angles)) {
    const coords = calculateReflections(parseFloat(key), value, origin, dimensions);
    const line = calculateStraightLines(parseFloat(key), value, origin, dimensions);
    reflections.push(coords);
    lines.push(line);
  }

  // eslint-disable-next-line
  const callback = useCallback(node => {
    if (node !== null) {
      setOffsetTop(node.offsetTop);
      setOffsetLeft(node.offsetLeft);
    }
  })

  const changeNode = (row, col) => {
    const middle = dimensionMirrors[0].length >> 1;
    const x = col - dimensionMirrors[0][middle - 1]
    const y = row - dimensionMirrors[1][middle - 1]
    if (!moveOrigin) {
      setOrigin([x, y]);
      setOffsetOffset([(x - 1) * 50, (y - 1) * 50])
    } else {
      setTarget([x, y]);
    }
  }
  
  return (
    <div className="App">
      <div className="Interface">
        <Slider
          min={2}
          step={1}
          max={3}
          value={dimensions[1]}
          onChange={(_, value) => {
            setDimensions([dimensions[0], value]);
          }}
        />
        <Slider
          min={3}
          step={1}
          max={4}
          value={dimensions[0]}
          onChange={(_, value) => {
            setDimensions([value, dimensions[1]]);
          }}
        />
        <Slider
          min={4}
          step={1}
          max={7}
          value={distance}
          onChange={(_, value) => {
            setDistance(value);
          }}
        />
        <label>
          Origin
          <Switch 
            value={moveOrigin}
            onChange={(_, value) => {
              setMoveOrigin(value);
            }}
          />
          Target    
        </label>
        <label>
          <input 
            type="checkbox" 
            defaultChecked={checked}
            onChange={handleCheck}
          />
          Show Mirrors
        </label>
      </div>
      <Grid
        myMirrors={originOffsetMirrors}
        guardMirrors={targetOffsetMirrors}
        dimensions={dimensionMirrors}
        checked={checked}
        forwardedCallback={callback}
        function={changeNode}
      />
      <LaserVisualiser 
        straight={lines}
        reflections={reflections}
        checked={checked}
        topOffset={offsetTop + 5 - offsetOffset[1]}
        leftOffset={offsetLeft + 5 - offsetOffset[0]}
      />
    </div>
  );
}

export default App;
