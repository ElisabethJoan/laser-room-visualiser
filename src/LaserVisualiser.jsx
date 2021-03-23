import React from "react";

export default class LaserVisualiser extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
      };
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
        let mx = your_pos[0];
        let my = your_pos[1];
        let gx = guard_pos[0];
        let gy = guard_pos[1];
        let width = dimensions[0];
        let height = dimensions[1];

        let matSize = Math.trunc(Math.max(dist / width, dist / height)) + 1
        let guardMirrors = [this.vectorMap(matSize, gx, width), this.vectorMap(matSize, gy, height)]
        let myMirrors = [this.vectorMap(matSize, mx, width), this.vectorMap(matSize, my, height)]
        let mirrors = [myMirrors, guardMirrors];

        let angles = new Set();
        let angleDist = {};
        for (let i = 0; i < mirrors.length; i++) {
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
                                angles.add(angle)
                            }
                        }
                    }
                    
                });
            });
        }
        console.log("result: ", angles.size)
        console.log("expected: ", expected)
    }



    render() {

        return (
            <div>
                <button onClick={() => this.laserCalculation([3, 2], [1, 1], [2, 1], 4, 7)}>Test 1</button>
                <button onClick={() => this.laserCalculation([300, 275], [150, 150], [185, 100], 500, 9)}>Test 2</button>
                {/* <button onClick={() => this.liltest()}>Test 3</button> */}
            </div>
        );
    }
}