import fs from "fs";
import _ from "lodash"
const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const parts = data.split(",")

let acc = 0;

for (const part of parts) {
	let val = 0;
	for (let i = 0; i < part.length; i++) {
		const chr = part[i];
		val += chr.charCodeAt(0);
		val *= 17;
		val %= 256;
	}
	acc += val;
}
console.log(acc)