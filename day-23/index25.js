import fs from "fs";
import _ from "lodash";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const grid = data.split("\n").map(x => x.split(""));

const start = [0, grid[0].indexOf(".")];
const end = [grid.length - 1, grid[grid.length - 1].indexOf(".")];

const checks = [{ curr: start, walked: new Set(), len: 0 }];
const ended = [];

while (checks.length) {
	const check = checks.shift();
	if (check.curr[0] === end[0] && check.curr[1] === end[1]) {
		ended.push(check);
		continue;
	};
	const av = [[0,1], [1,0], [-1, 0], [0, -1]];

	for (const adj of av) {
		const next = [check.curr[0] + adj[0], check.curr[1] + adj[1]];
		if (next[0] < 0 || next[0] >= grid.length) continue;
		if (next[1] < 0 || next[1] >= grid[0].length) continue;
		if (grid[next[0]][next[1]] === "#") continue;
		if (check.walked.has(`${next[0]},${next[1]}`)) continue;
		checks.push({
			curr: next,
			walked: new Set([...check.walked, `${next[0]},${next[1]}`]),
			len: check.len + 1,
		});
	}
}

const map = {};
let list = [start];
while (list.length) {
	const next = list.shift();
	if (next[0] === end[0] && next[1] === end[1]) continue;
	
}