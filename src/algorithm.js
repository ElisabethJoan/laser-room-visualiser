const mirrorCalculation = (dimensions, coordinates, dist) => {
  let [x, y] = coordinates;
  let width = dimensions[0];
  let height = dimensions[1];

  let matSize = Math.trunc(Math.max(dist / width, dist / height)) + 1
  let mirrors = [vectorMap(matSize, x, width), vectorMap(matSize, y, height)]
  
  return mirrors;
}

const dimensionMirrorsCalculation = (length, dimensions) => {
  let dimensionMirrors = [];
  dimensionMirrors.push([0], [0]);
  for (let i = 1; i < length + 1; i++) {
    dimensionMirrors[0].push(dimensions[0] * i);
    dimensionMirrors[1].push(dimensions[1] * i);
  }
  return dimensionMirrors;
}

const angleCalculation = (origin, mirrors, dist) => {
  let angles = new Set();
  let angleDist = {};
  for (let i = 0; i < mirrors.length; i++) {
    // eslint-disable-next-line
    mirrors[i][0].forEach(j => {
      mirrors[i][1].forEach(k => {
        let angle = Math.atan2((origin[1] - k), (origin[0] - j));
        let cdist = Math.sqrt((origin[0] - j) ** 2 + (origin[1] - k) ** 2)
        if ((!arraysEqual([j, k], origin)) && (dist >= cdist)) 
        {
          if (((angle in angleDist) && (angleDist[angle] > cdist)) || !(angle in angleDist)) 
          {
            if (i === 0) 
            {
              angleDist[angle] = cdist;
            }
            else 
            {
              angleDist[angle] = cdist;
              angles.add(angle);
            }
          }
        } 
      });
    });
  }

  //Formatting angles and distance in dictionary (angles are keys)
  let angdist = {}
  angles = Array.from(angles);
  angles.forEach((element) => {
    if (element in angleDist) {
      angdist[element] = angleDist[element]
    }
  })

  return angdist;
}

function offsetCoordinates(vectors, mirrors) {
    let offsetVectors = []
    const x_offset = mirrors[0][parseInt(mirrors[0].length/2) - 1]
    const y_offset = mirrors[1][parseInt(mirrors[0].length/2) - 1]

    offsetVectors[0] = vectors[0].map(coordinate => {
        return Math.abs(x_offset + coordinate)
    })
    offsetVectors[1] = vectors[1].map(coordinate => {
        return Math.abs(y_offset + coordinate)
    })
    return offsetVectors
}

const calculateReflections = (angle, distance, origin, dimensions) => {
  const dimensionWidth = dimensions[0];
  const dimensionHeight = dimensions[1];
  
  const walls = [[[0, 0], [dimensionWidth, 0]], 
    [[dimensionWidth, 0], [dimensionWidth, dimensionHeight]], 
    [[dimensionWidth, dimensionHeight], [0, dimensionHeight]], 
    [[0, dimensionHeight], [0, 0]]]

  const reflections = []
  const reflectionCoords = []
  reflections.push([origin, angle + Math.PI, distance]);
  function reflectLine(norigin, rangle, ndistance) {
    const nangle = (rangle + Math.PI)

    const x2 = Math.round(((norigin[0] + (ndistance * Math.cos(nangle))) * 100) / 100);
    const y2 = Math.round(((norigin[1] + (ndistance * Math.sin(nangle))) * 100) / 100);

    let intersection = null;
    let intersectingWall = null;
    walls.forEach(wall => {
      const tempIntersection = findIntersection([[norigin[0], norigin[1]], [x2, y2]], wall);
      if (tempIntersection !== null) {
        intersectingWall = wall;
        intersection = tempIntersection;
      }
    });
    if (intersection === null) {
      return;
    }

    reflectionCoords.push([norigin, intersection]);

    const newDistance = calcDistance(intersection, [x2, y2]);

    let newAngle;
    let dx = intersectingWall[0][0] - intersectingWall[1][0];
    let dy = intersectingWall[0][1] - intersectingWall[1][1];
    const c = Math.cos(nangle), s = Math.sin(nangle);
    if (dy === 0) {
      newAngle = Math.atan2(-s, c);
    } else if (dx === 0) {
      newAngle = Math.atan2(s, -c);
    }

    reflections.push([intersection, newAngle, newDistance]);
    reflectLine(intersection, newAngle + Math.PI, newDistance);
  }
  reflectLine(origin, angle, distance);

  const lastx = reflections[reflections.length - 1][0][0];
  const lasty = reflections[reflections.length - 1][0][1];
  const lastAngle = reflections[reflections.length - 1][1];
  const lastDistance = reflections[reflections.length - 1][2];
  
  const x2 = Math.round(((lastx + (lastDistance * Math.cos(lastAngle))) * 100) / 100);
  const y2 = Math.round(((lasty + (lastDistance * Math.sin(lastAngle))) * 100) / 100);

  reflectionCoords.push([[lastx, lasty], [x2, y2]]);
  return reflectionCoords;
}

const calculateStraightLines = (angle, distance, origin, dimensions) => {
  const dimensionWidth = dimensions[0];
  const dimensionHeight = dimensions[1];
  
  const walls = [[[0, 0], [dimensionWidth, 0]], 
    [[dimensionWidth, 0], [dimensionWidth, dimensionHeight]], 
    [[dimensionWidth, dimensionHeight], [0, dimensionHeight]], 
    [[0, dimensionHeight], [0, 0]]]

  const nangle = (angle + Math.PI)

  const xEnd = Math.round(((origin[0] + (distance * Math.cos(nangle))) * 100) / 100);
  const yEnd = Math.round(((origin[1] + (distance * Math.sin(nangle))) * 100) / 100);

  let intersection = null;
  walls.forEach(wall => {
    const tempIntersection = findIntersection([[origin[0], origin[1]], [xEnd, yEnd]], wall);
    if (tempIntersection !== null) {
      intersection = tempIntersection;
    }
  });
  if (intersection === null) {
    return [origin, [xEnd, yEnd]];
  }
  return [origin, intersection, [xEnd, yEnd]];
}

const findIntersection = (line1, line2) => {
  function ccw(A,B,C) {
    return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0])
  }

  function intersect(line11, line22) {
    return ccw(line11[0], line22[0], line22[1]) !== ccw(line11[1], line22[0], line22[1]) 
      && ccw(line11[0], line11[1], line22[0]) !== ccw(line11[0], line11[1], line22[1])
  }
  
  if (!intersect(line1, line2)) {
    return null
  }

  
  if (calcDistance(line2[0], line1[0]) + 
    calcDistance(line2[1], line1[0]) === calcDistance(line2[0], line2[1])) {
    return null
  }

  const a1 = line1[1][1] - line1[0][1];
  const b1 = line1[0][0] - line1[1][0];
  const c1 = a1 * line1[0][0] + b1 * line1[0][1];

  const a2 = line2[1][1] - line2[0][1];
  const b2 = line2[0][0] - line2[1][0];
  const c2 = a2 * line2[0][0] + b2 * line2[0][1];

  const determinant = a1 * b2 - a2 * b1;

  if (determinant === 0)
  {
    return null;
  }
  else
  {
    const x = (b2 * c1 - b1 * c2) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;
    return [x, y];
  }
}

function vectorMap(size, coord, length) {
  let vectMap = [coord];
  let count = 0;
  let l = -coord;
  let r = length - coord;
  let left, right;
  
  for (let i = 0; i < size; i++) {
    left = vectMap[0] + (l * 2);
    right = vectMap[count] + (r * 2);

    [l, r] = [-r, -l];

    vectMap.unshift(left)
    vectMap.push(right)
    
    count += 2;
  }
  return vectMap
}

const calcDistance = (point1, point2) => {
  return Math.sqrt((point2[0] - point1[0]) ** 2 + (point2[1] - point1[1]) ** 2);
}

function arraysEqual(a1,a2) {
  return JSON.stringify(a1) === JSON.stringify(a2);
}

export { mirrorCalculation, dimensionMirrorsCalculation, angleCalculation, 
  offsetCoordinates, calculateReflections, calculateStraightLines, arraysEqual }
