import fs from "fs";
import _ from "lodash";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const lines = data.split("\n");

const bricks = lines
	.map(x => x.split("~"))
	.map(x => ({
		start: x[0].split(",").map(x => +x),
		end: x[1].split(",").map(x => +x),
	}));
function intersect(a, b) {
	return (
		a.start[0] < b.end[0] + 1 &&
		a.end[0] + 1 > b.start[0] &&
		a.start[1] < b.end[1] + 1 &&
		a.end[1] + 1 > b.start[1] &&
		a.start[2] < b.end[2] + 1 &&
		a.end[2] + 1 > b.start[2]
	);
}
let fall = true;
while (fall) {
	fall = false;
	for (const brick of bricks) {
		if (brick.end[2] === 1 || brick.start[2] === 1) continue;
		const checkBox = {
			start: [brick.start[0], brick.start[1], brick.start[2] - 1],
			end: [brick.end[0], brick.end[1], brick.end[2] - 1],
		};
		const under = bricks
			.filter(x => x !== brick)
			.some(x => intersect(x, checkBox));
		if (!under) {
			brick.start[2] -= 1;
			brick.end[2] -= 1;
			fall = true;
		}
	}
}
const can = []
let k = 0;
for (const brick of bricks) {
	console.log(k++)
	let fall = false;
	const newB = bricks.filter(x => x !== brick);
	for (const brick of newB) {
		if (brick.end[2] === 1 || brick.start[2] === 1) continue;
		const checkBox = {
			start: [brick.start[0], brick.start[1], brick.start[2] - 1],
			end: [brick.end[0], brick.end[1], brick.end[2] - 1],
		};
		const under = newB
			.filter(x => x !== brick)
			.some(x => intersect(x, checkBox));
		if (!under) {
			fall = true;
			break;
		}
	}
	if (!fall) {
		can.push(brick);
	}
}
console.log(can.length)