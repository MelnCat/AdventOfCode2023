import fs from "fs";
import _ from "lodash";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const lines = data.split("\n");

const grid = lines.map(x => x.split(""));
const notDone = [];
const all = [];
const test = (startI, startJ, dirI, dirJ, cap) => {
	const beams = [{ i: startI - dirI, j: startJ - dirJ, dir: [dirI, dirJ] }];

	const energized = new Set();
	const old = new Set();

	let tot = 0;
	while (beams.length) {
		if (tot++ > cap) {
			notDone.push({startI, startJ, dirI, dirJ});
			break;
		};
		const beam = beams[0];
		beam.i += beam.dir[0];
		beam.j += beam.dir[1];
		const curr = grid[beam.i]?.[beam.j];
		if (!curr) {
			beams.shift();
			continue;
		}
		if (old.has(`${beam.i},${beam.j},${beam.dir[0]},${beam.dir[1]}`)) {
			beams.shift();
			continue;
		}
		old.add(`${beam.i},${beam.j},${beam.dir[0]},${beam.dir[1]}`)
		if (curr === "/") {
			if (beam.dir[0] === 0) {
				if (beam.dir[1] === 1) {
					beam.dir = [-1, 0];
				}
				if (beam.dir[1] === -1) {
					beam.dir = [1, 0];
				}
			} else if (beam.dir[1] === 0) {
				if (beam.dir[0] === 1) {
					beam.dir = [0, -1];
				} else if (beam.dir[0] === -1) {
					beam.dir = [0, 1];
				}
			}
		}
		if (curr === "\\") {
			if (beam.dir[0] === 0) {
				if (beam.dir[1] === 1) {
					beam.dir = [1, 0];
				} else if (beam.dir[1] === -1) {
					beam.dir = [-1, 0];
				}
			} else if (beam.dir[1] === 0) {
				if (beam.dir[0] === 1) {
					beam.dir = [0, 1];
				} else if (beam.dir[0] === -1) {
					beam.dir = [0, -1];
				}
			}
		}
		if (curr === "-") {
			if (beam.dir[1] === 0) {
				beams.push({ i: beam.i, j: beam.j, dir: [0, 1] });
				beams.push({ i: beam.i, j: beam.j, dir: [0, -1] });
				beams.shift();
			}
		} else if (curr === "|") {
			if (beam.dir[0] === 0) {
				beams.push({ i: beam.i, j: beam.j, dir: [1, 0] });
				beams.push({ i: beam.i, j: beam.j, dir: [-1, 0] });
				beams.shift();
			}
		}
		energized.add(`${beam.i},${beam.j}`);
	}
	all.push({startI, startJ, dirI, dirJ,num:energized.size});
	return energized.size;
};
let max = -1;

for (let col = 0; col < grid[0].length; col++) {
	test(0, col, 1, 0, 500000);
	test(grid.length - 1, col, -1, 0, 500000);
}
for (let row = 0; row < grid.length; row++) {
	test(row, 0, 0, 1, 500000);
	test(row, grid[0].length - 1, 0, -1, 500000);
}
console.log("E")
console.log(all.sort((a,b)=>b.num-a.num).slice(0,20).map(x=>test(x.startI, x.startJ, x.dirI, x.dirJ, 5000000)).reduce((l,c)=>l<c?c:l,0));