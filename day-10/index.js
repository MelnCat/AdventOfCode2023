import fs from "fs";

const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split(/\n\r?/).map(x => x.trim());

const grid = lines.map(x => x.split(""));


const sLoc = [grid.findIndex(x => x.includes("S")), grid.find(x => x.includes("S")).indexOf("S")];

const startPipe = { i: sLoc[0], j: sLoc[1], connections: [], distance: 0, char: "S" };

const allPipes = []
const pipes = []

const toCheck = [startPipe]
while (toCheck.length > 0) {
	const pipe = toCheck.shift();
	allPipes.push(pipe)
	const adjacent = [[0, 1, ["-", "7", "J"]], [0, -1, ["-", "L", "F"]], [1, 0, ["|", "L", "J"]], [-1, 0, ["|", "F", "7"]]].map(x => [x[0] + pipe.i, x[1] + pipe.j, x[2]]);
	for (const adj of adjacent) {
		const char = grid[adj[0]]?.[adj[1]];
		if (adj[2].includes(char)) {
			const p = pipes.find(x => x.i === adj[0] && x.j === adj[1]);
			if (p) continue;
			pipe.connections.push(p)
			const newP = { i: adj[0], j: adj[1], connections: [pipe], distance: pipe.distance + 1, char };
			pipes.push(newP);
			toCheck.push(newP)
		}
	}

}
console.log(pipes.sort((a,b)=>b.distance-a.distance)[0].distance)


