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

const times = lines[0]
	.split(":")[1]
	.trim()
	.split(/\s+/)
	.map(x => +x);
const distances = lines[1]
	.split(":")[1]
	.trim()
	.split(/\s+/)
	.map(x => +x);
const races = times.map((x, i) => ({ time: x, distance: distances[i] }));
let acc = 1;
const start = Date.now()
for (const race of races) {
	let n = 0;
	for (let i = 0; i < race.time; i++) {
		const speed = i;
		const d = (race.time - i) * speed;
		if (d > race.distance) n++;
	}
	acc *= n;
}
console.log(acc);
console.log(Date.now() - start)