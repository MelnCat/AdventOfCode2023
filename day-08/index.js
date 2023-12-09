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
let curr = "AAA";
while (curr !== "ZZZ") {
	const inst = instructions[n % instructions.length];
	curr = map[curr][inst === "L" ? "left" : "right"]
	n++;
}
console.log(n);