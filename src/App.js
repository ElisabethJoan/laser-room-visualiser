import { useState, useCallback } from "react";
import Slider from '@mui/material/Slider';

import { mirrorCalculation, dimensionMirrorsCalculation, angleCalculation, 
  offsetCoordinates, calculateReflections } from "./algorithm.js";

import LaserVisualiser from "./Visualiser/LaserVisualiser";
import Grid from "./Grid/Grid";
import "./App.css";

function App() {
  const [checked, setChecked] = useState(false);
  const [dimensions, setDimensions] = useState([3, 2]);
  // eslint-disable-next-line
  const [origin, setOrigin] = useState([1, 1]);
  // eslint-disable-next-line
  const [target, setTarget] = useState([2, 1]);
  // eslint-disable-next-line
  const [distance, setDistance] = useState(4);

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
  for (const [key, value] of Object.entries(angles)) {
    const coords = calculateReflections(parseFloat(key), value, origin, dimensions);
    reflections.push(coords)
  }
  
  const [offsetTop, setOffsetTop] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
 
  // eslint-disable-next-line
  const callback = useCallback(node => {
    if (node !== null) {
      setOffsetTop(node.offsetTop);
      setOffsetLeft(node.offsetLeft);
    }
  })

  return (
    <div className="App">
      <div className="Interface">
        <Slider
          min={2}
          step={1}
          max={3}
          value={dimensions[1]}
          onChange={(event, value) => {
            setDimensions([dimensions[0], value])
          }}
        />
        <Slider
          min={3}
          step={1}
          max={4}
          value={dimensions[0]}
          onChange={(event, value) => {
            setDimensions([value, dimensions[1]])
          }}
        />
        <label>
          <input 
            type="checkbox" 
            defaultChecked={checked}
            onChange={handleCheck}
          />
          Mirrors
        </label>
      </div>
      <Grid
        myMirrors={originOffsetMirrors}
        guardMirrors={targetOffsetMirrors}
        dimensions={dimensionMirrors}
        checked={checked}
        forwardedCallback={callback}
      />
      <LaserVisualiser 
        angdist={angles}
        reflections={reflections}
        checked={checked}
        topOffset={offsetTop + 5}
        leftOffset={offsetLeft + 5}
      />
    </div>
  );
}

export default App;
