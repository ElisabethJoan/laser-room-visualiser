import { useState } from "react";

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
      <label>
        <input 
          type="checkbox" 
          defaultChecked={checked}
          onChange={handleCheck}
        />
        Mirrors
      </label>
    </div>
  );
}

export default App;
