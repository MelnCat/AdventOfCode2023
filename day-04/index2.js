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
let start = Date.now();
const adjacent = (i, j) => [[i - 1, j - 1], [i - 1, j], [i - 1, j + 1], [i, j - 1], [i, j + 1], [i + 1, j - 1], [i + 1, j], [i + 1, j + 1]];

const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split("\n");

let acc = 0;

const mult = lines.map(x => 1);

for (let i = 0; i < lines.length; i++) {
	let line = lines[i];
	const num = line.match(/Card\s+(\d+)/)[1];
	const winning = line.split(": ")[1].split(" | ")[0].trim().split(/\s+/).map(Number);
	const has = line.split(": ")[1].split(" | ")[1].trim().split(/\s+/).map(Number);
	const len=  (has.filter(x => winning.includes(x)).length);
	const m = mult[i];
	console.log(len);
	for (let j = 0; j < len; j++) mult[j + i + 1] += m;
}


console.log(mult.reduce((l,c)=>l+c))
console.log(Date.now() - start + "ms");