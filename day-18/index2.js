import fs from "fs";
import _ from "lodash";
import pc from "polygon-clipping";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const lines = data.split("\n");

const plans = lines
	.map(x => x.split(" "))
	.map(x => ({ direction: x[0], steps: +x[1], color: x[2] }))
	.map(x => ({ direction: "RDLU"[x.color[7]], steps: parseInt(x.color.slice(2,7), 16) }));

let locs = [];

const pos = [0, 0];

for (const plan of plans) {
	const dir = {
		U: [0, -1],
		D: [0, 1],
		L: [-1, 0],
		R: [1, 0],
	}[plan.direction];
	pos[0] += dir[0] * plan.steps;
	pos[1] += dir[1] * plan.steps;
	locs.push(structuredClone(pos));
}

const lowestX = Math.min(...locs.map(x => x[0]));
const lowestY = Math.min(...locs.map(x => x[1]));
locs = locs.map(x => [x[0] - lowestX, x[1] - lowestY]);

const poly = [[0, 0], [0, 1], [1, 1], [1, 0]].map(x=>locs.map(y=>[y[0]+x[0],y[1]+x[1]]));
// shoelace formula
const shoelace = polygon => {
	let sum = 0n;
	for (let i = 0; i < polygon.length; i++) {
		const [x1, y1] = polygon[i];
		const [x2, y2] = polygon[(i + 1) % polygon.length];
		sum += BigInt(x1) * BigInt(y2) - BigInt(x2) * BigInt(y1);

	}
	return (sum / 2n);

}
console.log(locs.map(x=>`(${x.join(",")})`).join(","))
console.log(shoelace(pc.union(...poly.map(x=>[x]))[0][0]));