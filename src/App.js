import { useState, useCallback } from "react";
import Slider from "@mui/material/Slider";

import { HomeRow, SketchWrapper, BlogWrapper } from "@elisabethjoan/portfolio-scaffold";

import { mirrorCalculation, dimensionMirrorsCalculation, angleCalculation, 
  offsetCoordinates, calculateReflections, calculateStraightLines, arraysEqual } from "./algorithm.js";

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

  const changeNode = (e, row, col) => {
    console.log(e.button)
    const middle = dimensionMirrors[0].length >> 1;
    const x = col - dimensionMirrors[0][middle - 1];
    const y = row - dimensionMirrors[1][middle - 1];
    if (e.button === 0) {
      setOrigin([x, y]);
      setOffsetOffset([(x - 1) * 50, (y - 1) * 50]);
    } else {
      setTarget([x, y]);
    }
  }

  return (
    <div>
      <div className="App">
        <HomeRow extension=".jsx"/>
        <SketchWrapper>
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
        </SketchWrapper>
        <div className="Interface">
          <label>
            y axis
            <Slider
              min={2}
              step={1}
              max={4}
              value={dimensions[1]}
              onChange={(_, value) => {
                const newDimensions = [dimensions[0], value];
                if (origin[1] === value) {
                  let newOrigin = [origin[0], value - 1];
                  if (arraysEqual(newOrigin, target)) {
                    for (let j = newDimensions[1] - 1; j > 0; j--) {
                      for (let i = newDimensions[0] - 1; i > 0; i--) {
                        if (!arraysEqual([i, j], target)) {
                          newOrigin = [i, j];
                          i = j = -1;
                        }
                      }
                    }
                  }
                  setOrigin(newOrigin);
                  setOffsetOffset([(newOrigin[0] - 1) * 50, (newOrigin[1] - 1) * 50]);
                }
                if (target[1] === value) {
                  let newTarget = [target[0], value - 1];
                  if (arraysEqual(newTarget, origin))
                  for (let j = newDimensions[1] - 1; j > 0; j--) {
                    for (let i = newDimensions[0] - 1; i > 0; i--) {
                      if (!arraysEqual([i, j], origin)) {
                        newTarget = [i, j];
                        i = j = -1;
                      }
                    }
                  }
                  setTarget(newTarget);
                }
                setDimensions(newDimensions);
              }}
            />
          </label>
          <label>
            x axis
            <Slider
              min={3}
              step={1}
              max={6}
              value={dimensions[0]}
              onChange={(_, value) => {
                const newDimensions = [value, dimensions[1]];
                if (origin[0] === value ) {
                  let newOrigin = [value - 1, origin[1]];
                  if (arraysEqual(newOrigin, target)) {
                    for (let i = newDimensions[1] - 1; i > 0; i--) {
                      for (let j = newDimensions[0] - 1; j > 0; j--) {
                        if (!arraysEqual([j, i], target)) {
                          newOrigin = [j, i];
                          i = j = -1;
                        }
                      }
                    }
                  }
                  setOrigin(newOrigin);
                  setOffsetOffset([(newOrigin[0] - 1) * 50, (newOrigin[1] - 1) * 50]);
                }
                if (target[0] === value) {
                  let newTarget = [value - 1, target[1]];
                  if (arraysEqual(newTarget, origin)) {
                    for (let i = newDimensions[1] - 1; i > 0; i--) {
                      for (let j = newDimensions[0] - 1; j > 0; j--) {
                        if (!arraysEqual([j, i], origin)) {
                          newTarget = [j, i];
                          i = j = -1;
                        }
                      }
                    }
                  }
                  setTarget(newTarget);
                }
                setDimensions(newDimensions);
              }}
            />
          </label>
          <label>
            laser distance
            <Slider
              min={4}
              step={1}
              max={9}
              value={distance}
              onChange={(_, value) => {
                setDistance(value);
              }}
            />
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
        </div>
        <BlogWrapper title="Problem Description">
            <p style={{ textAlign: "center" }}>
  ==============
  Bringing a Gun to a Guard Fight
  ==============
            </p><p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tempus magna arcu, id fringilla magna facilisis sit amet. Maecenas leo velit, mollis at lectus quis, bibendum vestibulum arcu. Aliquam at turpis gravida, malesuada risus accumsan, condimentum lacus. Pellentesque et lorem id augue aliquet commodo. Cras lobortis pharetra urna, vitae ultrices massa commodo ut. Vestibulum efficitur efficitur dolor sit amet tincidunt. Suspendisse potenti. Donec dignissim ligula pellentesque auctor commodo. Curabitur posuere sapien a orci posuere, eget auctor ex placerat. Ut lobortis risus ut ex efficitur venenatis. Etiam eget enim ultricies, gravida justo non, dictum felis. Quisque at arcu tempor felis efficitur ullamcorper. Ut sed tincidunt quam. Aenean iaculis dui et metus tempus, sed pretium nulla molestie. Phasellus urna nunc, molestie ut mi a, rutrum euismod metus. Nunc id sem nunc.
            </p><p>
  Donec eget imperdiet justo. Phasellus id elit mollis, rhoncus erat sit amet, lacinia turpis. Quisque ut massa ac neque fermentum scelerisque id quis risus. Nunc vulputate velit ante. Aenean malesuada enim ac hendrerit vulputate. Donec arcu justo, mattis a erat vitae, fringilla accumsan sapien. Aenean mattis elit justo, sit amet euismod lorem egestas et. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec aliquet at quam sit amet interdum. Aenean lobortis convallis sodales. Maecenas maximus felis sed consectetur semper. Ut mollis metus quis magna feugiat dignissim. Suspendisse tincidunt elit eget est egestas dapibus. Praesent eget maximus neque, vitae posuere sapien. In varius pellentesque purus et volutpat. Duis in maximus felis.
            </p>
        </BlogWrapper>
      </div>
  );
}

export default App;
