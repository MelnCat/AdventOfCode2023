import fs from "fs";
import _ from "lodash";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const grid = data.split("\n").map(x => x.split(""));

const start = [grid.findIndex(x => x.includes("S")), grid.find(x => x.includes("S")).indexOf("S")];

let plots = [start];

for (let i = 0; i < 64; i++) {
	let toAdd = []
	let seen = new Set()
	for (const plot of plots) {
		for (const adj of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
			const newPlot = [plot[0] + adj[0], plot[1] + adj[1]];
			if (seen.has(newPlot.join(","))) continue;
			seen.add(newPlot.join(","));
			if (grid[newPlot[0]]?.[newPlot[1]] === "." || grid[newPlot[0]]?.[newPlot[1]] === "S") {
				toAdd.push(newPlot);
			}
		}
	}
	plots = toAdd;
}

console.log(plots.length)
