import fs from "fs";
import _ from "lodash";
const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split(/\n\r?/).map(x => x.trim());

const patterns = data.split(/\n\r?\n\r?/).map(x => x.split("\n").map(x=>x.trim()));
let acc = 0;
for (const pattern of patterns) {
	let found = -1;
	for (let i = 1; i < pattern.length; i++) {
		const first = pattern.slice(0, i).reverse();
		const second = pattern.slice(i);
		const zipped = _.zip(first, second).filter(x => x[0] !== undefined && x[1] !== undefined).map(x=>_.zip([...x[0]],[...x[1]]));
		const errors = zipped.map(x => x.reduce((l,c)=>c[0] === c[1] ? l : l+1, 0)).reduce((l,c)=>l+c, 0);
		if (errors===1){
			found = i;
		}
	}
	if (found === -1) {
		const transpose = pattern[0].split("").map((_, i) => pattern.map(x => x[i]).join(""));
		for (let i = 1; i < transpose.length; i++) {
			const first = transpose.slice(0, i).reverse();
			const second = transpose.slice(i);
			const zipped = _.zip(first, second).filter(x => x[0] !== undefined && x[1] !== undefined).map(x=>_.zip([...x[0]],[...x[1]]));
			const errors = zipped.map(x => x.reduce((l,c)=>c[0] === c[1] ? l : l+1, 0)).reduce((l,c)=>l+c, 0);
			if (errors===1){
				found = i;
			}
		}
		if (found < 0) throw "err"
		acc+= found;
	} else
	acc+= found*100;
}
console.log(acc);