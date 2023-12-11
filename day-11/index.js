import fs from "fs";

const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split(/\n\r?/).map(x => x.trim());

const grid = lines.map(x => x.split("")).flatMap(x => x.every(y => y === ".") ? [x, x] : [x]);
const cols = grid[0].map((x,i)=>[x,i]).filter(x => grid.every(y => y[x[1]] === ".")).map(x => x[1]);
const newGrid = grid.map(x => x.flatMap((y,i)=>cols.includes(i)?[y,y]:y));
console.log(newGrid.map(x=>x.join("")).join("\n"))

const galaxies = newGrid.flatMap((x, i) => x.flatMap((y, j) => y === "#" ? ({ i, j }) : []));

const dist = (a, b) => Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
let acc = 0;
for (let i = 0; i < galaxies.length; i++) {
	for (let j = i + 1; j < galaxies.length; j++) {
		acc += dist(galaxies[i], galaxies[j]);
	}
}
console.log(acc)
console.log(dist(galaxies[0], galaxies[6]))