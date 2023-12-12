import fs from "fs";

const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split(/\n\r?/).map(x => x.trim());

const springMaps = lines
	.map(x => x.split(" "))
	.map(x => ({ map: x[0], springNums: x[1].split(",").map(x => +x) }));

	let realTot = 0;
const countSprings = str => str.match(/^\.*(.+?)\.*$/)[1].split(/\.+/).map(x => x.length);;
for (const {map, springNums} of springMaps) {
	const qn = BigInt(map.split("?").length - 1);
	let total = 0;
	for (let i = 0n; i < 2n ** qn; i++) {
		let j = 0n;
		const replaced = map.replaceAll("?", () => i & (1n << j++) ? "#" : ".");
		const springs = countSprings(replaced);
		if (springs.length === springNums.length && springs.every((x, i) => x === springNums[i])) {
			total++;
		}
	}
	realTot += total;
}
console.log(realTot);
