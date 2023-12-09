import fs from "fs";
/**
 *
 * @param {number} length
 * @param {number} start
 * @returns
 */
const range = (length, start) =>
	Array(length)
		.fill(0)
		.map((_, i) => start + i);

/**
 *
 * @param {number} i
 * @param {number} j
 * @returns
 */
const adjacent = (i, j) => [
	[i - 1, j - 1],
	[i - 1, j],
	[i - 1, j + 1],
	[i, j - 1],
	[i, j + 1],
	[i + 1, j - 1],
	[i + 1, j],
	[i + 1, j + 1],
];

const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split("\n");

const instructions = lines[0].split("").filter(x => x !== "\r");
const nodes = [...data.matchAll(/(\w+) = \((\w+), (\w+)\)/g)].map(x => ({ name: x[1], left: x[2], right: x[3] }))

const map = nodes.reduce((l, c) => (l[c.name] = c, l), {});

let n = 0;
let currs = nodes.filter(x => x.name[2] === "A").map(x => x.name);
const cheese = []
for (const curr of currs) {
	let i = 0;
	let start = curr;
	const is = []
	while (curr !== start || i === 0) {
		start=map[start][instructions[i % instructions.length] === "L" ? "left" : "right"]
		if (start[2] === "Z") is.push(i)
		i++;
		if (i > 100000) break;
	}
	cheese.push(...is.map((x,i,a)=>a[i+1]-x))
}
console.log([...new Set(cheese)].filter(x => !isNaN(x)));