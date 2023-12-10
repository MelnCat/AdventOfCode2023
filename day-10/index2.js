import fs from "fs";

const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split(/\n\r?/);

const grid = lines.map(x => x.split(""));


const sLoc = [grid.findIndex(x => x.includes("S")), grid.find(x => x.includes("S")).indexOf("S")];

const startPipe = { i: sLoc[0], j: sLoc[1], connections: [], distance: 0, char: "S" };

const allPipes = []
const pipes = [startPipe]
const toCheck = [startPipe]
while (toCheck.length > 0) {
	const pipe = toCheck.shift();
	allPipes.push(pipe)
	const adjacent = [[0, 1, ["-", "7", "J"], ["-", "L", "F"]], [0, -1, ["-", "L", "F"], ["-", "7", "J"]], [1, 0, ["|", "L", "J"], ["|", "F", "7"]], [-1, 0, ["|", "F", "7"], ["|", "L", "J"]]].map(x => [x[0] + pipe.i, x[1] + pipe.j, x[2], x[3]]);
	for (const adj of adjacent) {
		const char = grid[adj[0]]?.[adj[1]];
		if (adj[2].includes(char) && (adj[3].includes(pipe.char) || pipe.char === "S")) {
			const p = pipes.find(x => x.i === adj[0] && x.j === adj[1]);
			if (p) continue;
			const newP = { i: adj[0], j: adj[1], connections: [pipe], distance: pipe.distance + 1, char };
			pipe.connections.push(newP)
			pipes.push(newP);
			toCheck.push(newP)
		}
	}

}

const newThing = grid.map(x => x.map(x => " "));
for (const pipe of pipes) {
	newThing[pipe.i][pipe.j] = pipe.connections.length >= 2 ? pipe.char.replaceAll("F", "┌")
	.replaceAll("7", "┐")
	.replaceAll("J", "┘")
	.replaceAll("L", "└")
	.replaceAll("|", "│")
	.replaceAll("-", "─") : " ";
	newThing[pipe.i][pipe.j] = pipe.connections.length >= 2 ? "█" : "X";
}
fs.writeFileSync(new URL("data2.txt", import.meta.url), newThing.map(x => x.join("")).join("\n"));
for (const pipe of pipes.filter(x=>x.connections.length!==2)) {
	
	const adjacent = [[0, 1, ["-", "7", "J"], ["-", "L", "F"]], [0, -1, ["-", "L", "F"], ["-", "7", "J"]], [1, 0, ["|", "L", "J"], ["|", "F", "7"]], [-1, 0, ["|", "F", "7"], ["|", "L", "J"]]].map(x => [x[0] + pipe.i, x[1] + pipe.j, x[2], x[3]]);
	for (const adj of adjacent) {
		const char = grid[adj[0]]?.[adj[1]];
		console.log(char)
		if (adj[2].includes(char) && (adj[3].includes(pipe.char) || pipe.char === "S")) {
		
			pipe.connections.push(pipes.find(x => x.i === adj[0] && x.j === adj[1]));
		}
	}
	pipe.connections = [...new Set(pipe.connections)]
}
console.log(pipes.filter(x=>x.connections.length!==2))
const start = pipes.filter(x => x.i === Math.min(...pipes.map(x => x.i))).sort((a,b)=>a.j - b.j)[0];
let curr = start;
let prev = -1;
let turnN = 0;
let dir = null;
let j = 0;
let p = 0;
const inside = [];
let its = 0;
while (true) {
	its++;
	let next = p === 0 ? curr.connections[0 /* change this number to 1 if turnN is negative */] : curr.connections.find(x => x !== prev);
	p = 1;
	//console.log(p, curr, next)
	if (!dir) dir = [next.i - curr.i, next.j - curr.j].join(":");
	const nextD = [next.i - curr.i, next.j - curr.j].join(":");
	const nameDir = {
		"0:-1": "N",
		"0:1": "S",
		"1:0": "E",
		"-1:0": "W"
	}
	const dirName = {
		"N": "0:-1",
		"S": "0:1",
		"E": "1:0",
		"W": "-1:0"
	}
	const dirN = nameDir[dir];
	const nextDirN = nameDir[nextD];
	if (nextD !== dir) {
		const directionTurn = {
			"N": {
				"E": "R",
				"W": "L"
			},
			"S": {
				"E": "L",
				"W": "R"
			},
			"E": {
				"N": "L",
				"S": "R"
			},
			"W": {
				"N": "R",
				"S": "L"
			}
		}[dirN][nextDirN];
		if (directionTurn === "R") turnN++;
		if (directionTurn === "L") turnN--;
		dir = nextD;
	}
	const right = dirName[{
		"N": "E",
		"S": "W",
		"E": "S",
		"W": "N"
	}[nextDirN]].split(":").map(x => +x);
	inside.push([curr.i + right[0], curr.j + right[1]])
	const right2 = dirName[{
		"N": "E",
		"S": "W",
		"E": "S",
		"W": "N"
	}[dirN]].split(":").map(x => +x);
	inside.push([curr.i + right2[0], curr.j + right2[1]])
	prev = curr;
	curr = next;

	if (j === 1) break;
	if (next === start) j = 1;
}
const toCheck2 = inside.filter(x => !pipes.find(y => y.i === x[0] && y.j === x[1])).filter(
	x => x[0] > 0 && x[1] > 0 && x[0] < grid.length - 1 && x[1] < grid[0].length - 1
);
const realOutside = [];

const floodFill = (i, j) => {
	if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length) return;
	if (pipes.find(x => x.i === i && x.j === j)) return;
	if (realOutside.find(x => x[0] === i && x[1] === j)) return;
	if (toCheck2.find(x => x[0] === i && x[1] === j)) return;
	realOutside.push([i, j]);
	toCheck2.push([i + 1, j]);
	toCheck2.push([i - 1, j]);
	toCheck2.push([i, j + 1]);
	toCheck2.push([i, j - 1]);
}
while (toCheck2.length > 0) {
	const [i, j] = toCheck2.shift();
	floodFill(i, j);
}
console.log(inside, turnN, its, pipes.length, realOutside.length)

const newThing2 = grid.map(x => x.map(x => " "));
for (const real of realOutside) {
	newThing2[real[0]][real[1]] = "█";
}

fs.writeFileSync(new URL("data3.txt", import.meta.url), newThing2.map(x => x.join("")).join("\n"));