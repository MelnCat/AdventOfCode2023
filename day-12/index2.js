import fs from "fs";

const data = process.argv.slice(2).join(" ").split("/").join("\n") || fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");
const lines = data.split(/\n\r?/).map(x => x.trim());

const springMaps = lines
	.map(x => x.split(" "))
	.map(x => ({ map: [...Array(5)].fill(x[0]).join("?"), springNums: [...Array(5)].flatMap(() => x[1].split(",").map(x => +x)) }));
	let realTot = 0;
const countSprings = str => str.match(/^\.*(.+?)\.*$/)[1].split(/[.]+/).map(x => x.includes("?") ? x.indexOf("#") + 1 : x.length);
const cache = {};
let i = 0;
for (const {map, springNums} of springMaps) {
	console.log(`${i++}/${springMaps.length}`)
	const total = [];
	const queue = [map];
	const check = (str, springs) => {
		if (str.length < springs.length) return 0;
		if (cache[str+":"+springs]) return cache[str+":"+springs];
		if (!str) return 0;
		const first = str.match(/^\.*([?#]+)\.*/)[1];
		const qn = BigInt(first.split("?").length - 1);
		let tot = 0;
		const springSum = springs.reduce((l,c)=>l+c,0);
		const totSpaces = str.length - springSum;
		const requirements = [...first.matchAll(/#/g)].map(x=>x.index);
		const a = []
		const p = {}
		const create = acc => {
			const spaces = acc.filter(x=>x===".").length;
			const other = acc.length - spaces;
			const curr = springs.slice(0, other).reduce((l,c)=>l+c,0) + spaces;
			const id = [spaces,other,curr,acc.at(-1)].join(",");
			if (id in p) return p[id];
			if (curr === str.length && other === springs.length) { 
				//console.log(str, curr, str.length, other === springs.length, totSpaces, spaces, other, springs, acc.join(""));
				return p[id] = 1;
			};
			let res = 0;
			//if (Math.random() < 0.999) console.log(acc);
			if (spaces < totSpaces && !requirements.includes(curr)) res+=(create([...acc, "."]));
			if (acc.at(-1) !== "#" && other < springs.length) res+=(create([...acc, "#"])); 
			return p[id] = res;
		}
		tot += create([]);
		cache[str+":"+springs] = tot;
		//console.log("CACHED",str+":"+springs);
		return tot;
	}
	const check2 = (str, springs) => {
		str = str.match(/\.*(.*)\.*/)[1];
		if (cache[str+":"+springs]) return cache[str+":"+springs];
		const split = str.split(/\.+/);
		if (springs.length === 0) return str.includes("#") ? 0 : 1;
		if (split.length === 1) return check(str, springs);
		const first = split[0];
		let acc = 0;
		for (let i = 0; i <= springs.length; i++) {
			const spr = springs.slice(0, i);
			const c = check(first, spr);
			if (c === 0) continue;
			acc += c * check2(str.replace(first, ""), springs.slice(i));
			//console.log(c, "*", check2(str.replace(first, ""), springs.slice(i)), ` (${spr} ${springs.slice(i)})`)
		}
		cache[str+":"+springs] = acc;
		//console.log("=", acc)
		return acc;
	}

	realTot+=(check2(map, springNums))
	//realTot+=(check2("???????????????????????????????????????????", [1,1,1,1,1,1,1]))
}
console.log(realTot);
