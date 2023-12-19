import fs from "fs";
import _ from "lodash";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const [ruleLines, partLines] = data.split("\n\n");

const rules = ruleLines
	.split("\n")
	.map(x => {
		const [, name, steps] = x.match(/(\w+)\{(.+)\}/);
		return { name, steps: steps.split(",").map(y => {
			const [cond, target] = y.split(":");
			if (!y.includes(":")) return { op: "true", target: y }
			const [, prop, op, num] = cond.match(/(\w+)([><])(\w+)/);
			return { prop, op, num: +num, target };
		}) };
	});

const parts = partLines.split("\n").map(x=>eval(`(${x.replaceAll("=",":")})`))

const find = (p, name)=> {
	const rule = rules.find(x => x.name === name);
	for (const step of rule.steps) {
		if (step.op === "true") {
			return step.target;
		} else {
			if (step.op === ">") {
				if (p[step.prop] > step.num) return step.target;
			} else if (step.op === "<") {
				if (p[step.prop] < step.num) return step.target;
			}
		}
	}
}
let acc = 0;
for (const part of parts) {
	let curr = "in";
	while (!"AR".includes(curr)) {
		curr = find(part, curr);
	}
	if (curr === "A") acc += Object.values(part).reduce((l,c)=>l+c,0);
}
console.log(acc)