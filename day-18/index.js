import fs from "fs";
import _ from "lodash"
const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8").replaceAll("\r", "");

const lines = data.split("\n");

const plans = lines.map(x => x.split(" ")).map(x => ({ direction: x[0], steps: +x[1], color: x[2] }));

let locs = [];

const pos = [0, 0];

for (const plan of plans) {
	const dir = {
		U: [0, -1],
		D: [0, 1],
		L: [-1, 0],
		R: [1, 0]
	}[plan.direction];
	for (let i = 0; i < plan.steps; i++) {
		pos[0] += dir[0];
		pos[1] += dir[1];
		locs.push(structuredClone(pos));
	}
}

const lowestX = Math.min(...locs.map(x => x[0]));
const lowestY = Math.min(...locs.map(x => x[1]));
locs=locs.map(x=>[x[0]-lowestX,x[1]-lowestY]);

const grid = Array(Math.max(...locs.map(x => x[1])) + 1).fill().map((x,i) => Array(Math.max(...locs.map(x => x[0])) + 1).fill(0).map((_,j) => locs.some(x => x[0] === j && x[1] === i) ? "#" : "."));

console.log(grid.map(x=>x.join("")).join("\n"))

const seen = new Set();


const q = [[105, 128]]; // i looked at the thing and found the interior

while (q.length) {
	const [x, y] = q.shift();
	if (seen.has(`${x},${y}`)) continue;
	seen.add(`${x},${y}`);
	for (const dir of [[0, -1], [0, 1], [1, 0], [-1, 0]]) {
		if (grid[y + dir[1]]?.[x + dir[0]] === ".") q.push([x + dir[0], y + dir[1]]);
	}
}

console.log(seen.size)
console.log(seen.size + locs.length)