import fs from "fs";
import _ from "lodash";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const grid = data.split("\n").map(x => x.split(""));

const start = [0, grid[0].indexOf(".")];
const end = [grid.length - 1, grid[grid.length - 1].indexOf(".")];

const cache = {}
const findConnections = s => {
	if (cache[`${s[0]},${s[1]}`]) return cache[`${s[0]},${s[1]}`];
	const checks = [{ curr: s, walked: new Set([`${s[0]},${s[1]}`]), len: 0 }];
	const found = []
	while (checks.length) {
		const check = checks.shift();

		const av = [
			[0, 1],
			[1, 0],
			[-1, 0],
			[0, -1],
		];

		const adjs = av.map(x => [check.curr[0] + x[0], check.curr[1] + x[1]]).filter(
			x =>
				x[0] >= 0 &&
				x[0] < grid.length &&
				x[1] >= 0 &&
				x[1] < grid[0].length &&
				grid[x[0]][x[1]] !== "#"
		);

		if (adjs.length > 2 && check.curr !== s) {
			found.push(check);
			continue;
		}

		for (const next of adjs) {
			if (check.walked.has(`${next[0]},${next[1]}`)) continue;
			if (next[0] === end[0] && next[1] === end[1]) {
				found.push({ curr: next, len: check.len + 1 });
				continue;
			};
			checks.push({
				curr: next,
				walked: new Set([...check.walked, `${next[0]},${next[1]}`]),
				len: check.len + 1,
			});
		}
	}
	cache[`${s[0]},${s[1]}`] = found.map(x=>({ to: x.curr, cost: x.len }));
	return found.map(x=>({ to: x.curr, cost: x.len }));
};

const map = {};
let list = [start];
while (list.length) {
	const next = list.shift();
	if (next[0] === end[0] && next[1] === end[1]) continue;
	const connections = findConnections(next);
	map[`${next[0]},${next[1]}`] = connections;
	list.push(...connections.map(x=>x.to).filter(x => !(`${x[0]},${x[1]}` in map)));
}

const paths = [{ curr: start, walked: new Set(), len: 0 }];
let lens = []
console.log(`done f`)
let k = 0;
while (paths.length) {
	const path = paths.pop();
	if (k++ % 1000 === 0) console.log(k, paths.length, lens.sort((a,b)=>b-a).at(0));
	if (path.curr[0] === end[0] && path.curr[1] === end[1]) {
		lens.push(path.len);
		continue;
	}
	for (const next of map[`${path.curr[0]},${path.curr[1]}`]) {
		if (path.walked.has(`${next.to[0]},${next.to[1]}`) || path.walked.has(`${next.to[1]},${next.to[0]}`)) continue;
		paths.push({
			curr: next.to,
			walked: new Set([...path.walked, `${next.to[0]},${next.to[1]}`]),
			len: path.len + next.cost,
		});
	}
}

console.log(Math.max(...lens))