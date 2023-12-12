import fs from "fs";

const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split(/\n\r?/).map(x => x.trim());
if (lines.at(-1) === "") lines.pop();
const grid = lines.map(x => x.split(""));
const emptyCols = grid[0].map((x,i)=>[x,i]).filter(x => grid.every(y => y[x[1]] === ".")).map(x => x[1]);
const emptyRows = grid.map((x,i)=>[x,i]).filter(x => x[0].every(y => y === ".")).map(x => x[1]);
const emptyColsBefore = {}
let a = 0;
for (let i = 0; i < grid[0].length; i++) {
	emptyColsBefore[i] = a;
	if (emptyCols.includes(i)) a++;
}
const emptyRowsBefore = {}
a = 0;
for (let i = 0; i < grid.length; i++) {
	emptyRowsBefore[i] = a;
	if (emptyRows.includes(i)) a++;
}
console.log(emptyRows)


const galaxies = grid.flatMap((x, i) => x.flatMap((y, j) => y === "#" ? ({ i, j }) : []));

const dist = (a, b) => {
	const emptyRowsBetween = Math.abs(emptyRowsBefore[b.i] - emptyRowsBefore[a.i]);
	const emptyColsBetween = Math.abs(emptyColsBefore[b.j] - emptyColsBefore[a.j]);
	const nonEmptyRowsBetween = Math.abs(a.i - b.i) - emptyRowsBetween;
	const nonEmptyColsBetween = Math.abs(a.j - b.j) - emptyColsBetween;
	return emptyRowsBetween * 1000000 + emptyColsBetween * 1000000 + nonEmptyRowsBetween + nonEmptyColsBetween;
};
let acc = 0;
for (let i = 0; i < galaxies.length; i++) {
	for (let j = i + 1; j < galaxies.length; j++) {
		acc += dist(galaxies[i], galaxies[j]);
	}
}
console.log(acc)
console.log(dist(galaxies[4], galaxies[8]))