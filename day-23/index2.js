import fs from "fs";
import _ from "lodash";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const grid = data.split("\n").map(x => x.split(""));

const start = [0, grid[0].indexOf(".")];
const end = [grid.length - 1, grid[grid.length - 1].indexOf(".")];

let checks = [{ curr: start, walked: new Set(), len: 0, last: [null, null], previ: { curr: start, len: 0 } }];
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
			let previ = check.previ;
	if (neighbors.length > 1) {
		intersectionMax[`${check.curr[0]},${check.curr[1]}`] ??= [];
		intersectionMax[`${check.curr[0]},${check.curr[1]}`].push(check.len);
		grab[`${previ.curr[0]},${previ.curr[1]}`] ??= [];
		const t= grab[`${previ.curr[0]},${previ.curr[1]}`].find(x => x.to === check.curr.join(","));
		if (t) {
			t.l = Math.max(t.l, check.len - previ.len);
		} else
		grab[`${previ.curr[0]},${previ.curr[1]}`].push({ l: check.len - previ.len, to: check.curr.join(",") });
		previ = check;
	}
	for (const next of neighbors) {
		checks.push({
			curr: next,
			walked: new Set([...check.walked, `${next[0]},${next[1]}`]),
			len: check.len + 1,
			last: check.curr,
			previ,
		});
	}
}
console.log(grab)
console.log(Math.max(...ended.map(x => x.len)));
