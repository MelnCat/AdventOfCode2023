import fs from "fs";
/**
 * 
 * @param {number} length 
 * @param {number} start 
 * @returns 
 */
const range = (length, start) => Array(length).fill(0).map((_, i) => start + i);

/**
 * 
 * @param {number} i 
 * @param {number} j 
 * @returns 
 */
const adjacent = (i, j) => [[i - 1, j - 1], [i - 1, j], [i - 1, j + 1], [i, j - 1], [i, j + 1], [i + 1, j - 1], [i + 1, j], [i + 1, j + 1]];

const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split("\n");

let acc = 0;
for (const line of lines) {

	const winning = line.split(": ")[1].split(" | ")[0].trim().split(/\s+/).map(Number);
	const has = line.split(": ")[1].split(" | ")[1].trim().split(/\s+/).map(Number);
	const len=  (has.filter(x => winning.includes(x)).length);
	const n = len === 0 ? 0 : 2 ** (len - 1);
	acc += n === 0 ? 0 : 2 ** (n - 1)
}
console.log(acc)