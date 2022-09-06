import React from "react";
import './LaserVisualiser.css';
import Grid from './Grid'

const DIMENSIONS = [[3], [2]];
const YOUR_POS = [[1], [1]];
const GUARD_POS = [[2], [1]];
const DISTANCE = 4;

export default class LaserVisualiser extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        myMappedCoords: YOUR_POS,
        guardMappedCoords: GUARD_POS,
        anglesdist: {},
        dimensionMirrors: DIMENSIONS,
        checked: false,
      };

      this.handleCheck = this.handleCheck.bind(this);
    }


    handleCheck() {
        this.setState({ checked: !this.state.checked })
    }

    componentDidMount() {
        this.laserCalculation([...DIMENSIONS[0], ...DIMENSIONS[1]], [...YOUR_POS[0], ...YOUR_POS[1]], [...GUARD_POS[0], ...GUARD_POS[1]], DISTANCE, 7)
    }

    arraysEqual(a1,a2) {
        return JSON.stringify(a1) === JSON.stringify(a2);
    }

    vectorMap(size, coord, length) {
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

    laserCalculation(dimensions, your_pos, guard_pos, dist, expected) {
        let [mx, my] = your_pos;
        let [gx, gy] = guard_pos;
        let width = dimensions[0];
        let height = dimensions[1];

        let matSize = Math.trunc(Math.max(dist / width, dist / height)) + 1
        let myMirrors = [this.vectorMap(matSize, mx, width), this.vectorMap(matSize, my, height)]
        let guardMirrors = [this.vectorMap(matSize, gx, width), this.vectorMap(matSize, gy, height)]
        let mirrors = [myMirrors, guardMirrors];

        let angles = new Set();
        let angleDist = {};
        for (let i = 0; i < mirrors.length; i++) {
            // eslint-disable-next-line no-loop-func
            mirrors[i][0].forEach(j => {
                mirrors[i][1].forEach(k => {
                    let angle = Math.atan2((your_pos[1] - k), (your_pos[0] - j));
                    let cdist = Math.sqrt((your_pos[0] - j) ** 2 + (your_pos[1] - k) ** 2)
                    if ((!this.arraysEqual([j, k], your_pos)) && (dist >= cdist)) 
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
        // console.log("result: ", angles.size);
        // console.log("expected: ", expected);

        //Formatting angles and distance in dictionary (angles are keys)
        let angdist = {}
        angles = Array.from(angles);
        angles.forEach((element) => {
            if (element in angleDist) {
                angdist[element] = angleDist[element]
            }
        })

        let dimensionMirrors = [];
        dimensionMirrors.push([0], [0]);
        for (let i = 1; i < myMirrors[0].length + 1; i++) {
            dimensionMirrors[0].push(DIMENSIONS[0] * i);
            dimensionMirrors[1].push(DIMENSIONS[1] * i);
        }

        this.setState({ myMappedCoords:this.offsetCoordinates(myMirrors, dimensionMirrors), guardMappedCoords:this.offsetCoordinates(guardMirrors, dimensionMirrors), angdist, dimensionMirrors:dimensionMirrors})
    }

    offsetCoordinates(vectors, mirrors) {
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



    render() {
        const { myMappedCoords, guardMappedCoords, angdist, dimensionMirrors, checked } = this.state;

        return (
            <div className="LaserVisualiser">
                <Grid 
                    key={1}
                    myMirrors={myMappedCoords}
                    guardMirrors={guardMappedCoords}
                    angdist={angdist}
                    dimensions={dimensionMirrors}
                    checked={checked}
                />
                <label>
                    <input 
                        type="checkbox" 
                        defaultChecked={this.state.checked}
                        onChange={this.handleCheck}
                    />
                    Mirrors
                </label>
                <p>Is "Value 1" checked? {this.state.checked.toString()}</p>
            </div>
        );
    }
}