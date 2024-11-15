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
            </p>
<p>Uh-oh - you've been cornered by one of Commander Lambdas elite guards! Fortunately, you grabbed a beam weapon from an abandoned guard post while you were running through the station, so you have a chance to fight your way out. But the beam weapon is potentially dangerous to you as well as to the elite guard: its beams reflect off walls, meaning you'll have to be very careful where you shoot to avoid bouncing a shot toward yourself!</p>

<p>Luckily, the beams can only travel a certain maximum distance before becoming too weak to cause damage. You also know that if a beam hits a corner, it will bounce back in exactly the same direction. And of course, if the beam hits either you or the guard, it will stop immediately (albeit painfully).</p>

<p>Write a function solution(dimensions, your_position, guard_position, distance) that gives an array of 2 integers of the width and height of the room, an array of 2 integers of your x and y coordinates in the room, an array of 2 integers of the guard's x and y coordinates in the room, and returns an integer of the number of distinct directions that you can fire to hit the elite guard, given the maximum distance that the beam can travel.</p>

<p>{"The room has integer dimensions [1 < x_dim <= 1250, 1 < y_dim <= 1250]. You and the elite guard are both positioned on the integer lattice at different distinct positions (x, y) inside the room such that [0 < x < x_dim, 0 < y < y_dim]. Finally, the maximum distance that the beam can travel before becoming harmless will be given as an integer 1 < distance <= 10000"}</p>

<p>For example, if you and the elite guard were positioned in a room with dimensions [3, 2], your_position [1, 1], guard_position [2, 1], and a maximum shot distance of 4, you could shoot in seven different directions to hit the elite guard (given as vector bearings from your location): [1, 0], [1, 2], [1, -2], [3, 2], [3, -2], [-3, 2], and [-3, -2]. As specific examples, the shot at bearing [1, 0] is the straight line horizontal shot of distance 1, the shot at bearing [-3, -2] bounces off the left wall and then the bottom wall before hitting the elite guard with a total shot distance of sqrt(13), and the shot at bearing [1, 2] bounces off just the top wall before hitting the elite guard with a total shot distance of sqrt(5).</p>
        </BlogWrapper>
      </div>
  );
}

export default App;
