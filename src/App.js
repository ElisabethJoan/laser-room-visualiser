import { useState } from "react";
import Slider from '@mui/material/Slider';

import { mirrorCalculation, dimensionMirrorsCalculation, angleCalculation, 
  offsetCoordinates, calculateReflections } from "./algorithm.js";

import LaserVisualiser from "./Visualiser/LaserVisualiser";
import Grid from "./Grid/Grid";
import "./App.css";

function App() {
  const [checked, setChecked] = useState(false);
  const [dimensions, setDimensions] = useState([3, 2]);
  const [origin, setOrigin] = useState([1, 1]);
  const [target, setTarget] = useState([2, 1]);
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

  return (
    <div className="App">
      <div className="Interface">
        <Slider
          min={2}
          step={1}
          max={4}
          value={2}
          onChange={(event, value) => {
          }}
        />
        <Slider
          min={6}
          step={1}
          max={12}
          value={6}
          onChange={(event, value) => {
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
      />
      <LaserVisualiser 
        angdist={angles}
        reflections={reflections}
        checked={checked}
      />
    </div>
  );
}

export default App;
