import fs from "fs";
import _ from "lodash";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const grid = data.split("\n").map(x => x.split(""));

const start = [0, grid[0].indexOf(".")];
const end = [grid.length - 1, grid[grid.length - 1].indexOf(".")];

let checks = [{ curr: start, walked: new Set(), len: 0, last: [null, null], previ: null }];
const ended = [];
let n = 0;
const intersectionMax = {};
const grab = {};
while (checks.length) {
	const check = checks.shift();
	if (check.curr[0] === end[0] && check.curr[1] === end[1]) {
		ended.push(check);
		continue;
	}

	if (!(n++ % 1000)) console.log("CURR " + n++, checks.length);
	const neighbors = [
		[0, 1],
		[1, 0],
		[-1, 0],
		[0, -1],
	]
		.map(x => [x[0] + check.curr[0], x[1] + check.curr[1]])
		.filter(
			x =>
				x[0] >= 0 &&
				x[0] < grid.length &&
				x[1] >= 0 &&
				x[1] < grid[0].length &&
				grid[x[0]][x[1]] !== "#" &&
				!(x[0] === check.last[0] && x[1] === check.last[1]) &&
				!check.walked.has(`${x[0]},${x[1]}`)
		);
	for (const next of neighbors) {
		checks.push({
			curr: next,
			walked: new Set([...check.walked, `${next[0]},${next[1]}`]),
			len: check.len + 1,
			last: check.curr,
			previ: check,
		});
	}
}
console.log(grab)
console.log(Math.max(...ended.map(x => x.len)));
