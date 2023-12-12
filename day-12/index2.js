import fs from "fs";

const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split(/\n\r?/).map(x => x.trim());

const springMaps = lines
	.map(x => x.split(" "))
	.map(x => ({ map: [...Array(5)].fill(x[0]).join("?"), springNums: [...Array(5)].flatMap(() => x[1].split(",").map(x => +x)) }));

	let realTot = 0;
const countSprings = str => str.match(/^\.*(.+?)\.*$/)[1].split(/[.]+/).map(x => x.includes("?") ? x.indexOf("#") + 1 : x.length);

const cache = {};
for (const {map, springNums} of springMaps) {
	const total = [];
	const queue = [map];
	console.log("CHECKING MAP")
	const check = (str, springs) => {
		if (str.length < springs.length) return 0;
		if (cache[str+":"+springs]) return cache[str+":"+springs];
		if (!str) return 0;
		if (Math.random() > 0.99) console.log(cache)
		const first = str.match(/^\.*([?#]+)\.*/)[1];
		const qn = BigInt(first.split("?").length - 1);
		let tot = 0;
		for (let i = 0n; i <= qn; i++) {
			let j = 0n;
			const replaced = str.replace(first, first.replaceAll("?", () => {
				const ix = j++;
				return ix < i ? "#" : ix === i ? "." : "?";
			}));
			const countStart = replaced.match(/^(#+)(\.|$)/)?.[1].length ?? 0;
			if (countStart > springs[0]) break;
			if (countStart !== springs[0] && countStart !== 0) continue;
			if (countStart === 0) {
				tot += check(replaced.replace(/^\.+/, ""), springs);
			};
			if (countStart === springs[0]) {
				if (springs.length === 1) tot++;
				else tot += check(replaced.replace(/^#+\.*/, ""), springs.slice(1));
			}

		}
		cache[str+":"+springs] = tot;
		return tot;
	}
	realTot+=(check("?.?", [1,1]))
}
console.log(realTot);
console.log(cache)
