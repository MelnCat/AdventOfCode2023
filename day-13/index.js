import fs from "fs";
import _ from "lodash"
const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split(/\n\r?/).map(x => x.trim());

const patterns = data.split(/\n\r?\n\r?/).map(x => x.split("\n").map(x=>x.trim()));
let acc = 0;
for (const pattern of patterns) {
	let found = -1;
	for (let i = 1; i < pattern.length; i++) {
		const first = pattern.slice(0, i).reverse();
		const second = pattern.slice(i);
		let errors = 0;
		const zipped = _
		if (first.every((y, j) => second[j] === y || second[j] === undefined)) {
			found = i;
		}
	}
	if (found === -1) {
		const transpose = pattern[0].split("").map((_, i) => pattern.map(x => x[i]).join(""));
		console.log(transpose)
		for (let i = 1; i < transpose.length; i++) {
			const first = transpose.slice(0, i).reverse();
			const second = transpose.slice(i);
			if (first.every((y, j) => second[j] === y || second[j] === undefined)) {
				found = i;
			}
		}
		if (found < 0) throw "err"
		acc += found ;
	} else acc += found * 100;
}
console.log(acc)