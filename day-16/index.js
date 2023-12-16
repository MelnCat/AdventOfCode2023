import fs from "fs";
import _ from "lodash"
const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8").replaceAll("\r", "");

const lines = data.split("\n");

const grid = lines.map(x=>x.split(""));

const beams = [
	{ i: 0, j: -1, dir: [0,1] },
]

const energized = new Set();

let tot = 0;
while (beams.length) {
	if (tot++ > 500000) break;
	const beam = beams[0];
	beam.i += beam.dir[0];
	beam.j += beam.dir[1];
	const curr = grid[beam.i]?.[beam.j];
	if (!curr) {
		beams.shift();
		continue;
	}
	if (curr === "/") {
		if (beam.dir[0] === 0) {
			if (beam.dir[1] === 1) {
				beam.dir = [-1, 0];
			}
			if (beam.dir[1] === -1) {
				beam.dir = [1, 0];
			}
		}
		else if (beam.dir[1] === 0) {
			if (beam.dir[0] === 1) {
				beam.dir = [0, -1];
			}
			else if (beam.dir[0] === -1) {
				beam.dir = [0, 1];
			}
		}
	}
	if (curr === "\\") {
		if (beam.dir[0] === 0) {
			if (beam.dir[1] === 1) {
				beam.dir = [1, 0];
			}
			else if (beam.dir[1] === -1) {
				beam.dir = [-1, 0];
			}
		}
		else if (beam.dir[1] === 0) {
			if (beam.dir[0] === 1) {
				beam.dir = [0, 1];
			}
			else if (beam.dir[0] === -1) {
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
	}
	else if (curr === "|") {
		if (beam.dir[0] === 0) {
			beams.push({ i: beam.i, j: beam.j, dir: [1, 0] });
			beams.push({ i: beam.i, j: beam.j, dir: [-1, 0] });
			beams.shift();
		}
	}
	energized.add(`${beam.i},${beam.j}`);
}
console.log(energized.size)
console.log(grid.map((x,i)=>x.map((y, j) => energized.has(`${i},${j}`) ? "O" : y).join("")).join("\n") + "\n");