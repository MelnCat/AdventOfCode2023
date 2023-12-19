import fs from "fs";
import _ from "lodash";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const [ruleLines, partLines] = data.split("\n\n");

let rules = ruleLines.split("\n").map(x => {
	const [, name, steps] = x.match(/(\w+)\{(.+)\}/);
	return {
		name,
		steps: steps.split(",").map(y => {
			const [cond, target] = y.split(":");
			if (!y.includes(":")) return { op: "true", target: y };
			const [, prop, op, num] = cond.match(/(\w+)([><])(\w+)/);
			return { prop, op, num: +num, target };
		}),
	};
});

const find = (p, name) => {
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
};
const findRange = (range, name) => {
	const rule = rules.find(x => x.name === name);
	let curr = structuredClone(range);
	let returns = [];
	for (const step of rule.steps) {
		if (step.op === "true") {
			returns.push({ name: step.target, range: structuredClone(curr) });
			break;
		} else {
			if (step.op === ">") {
				if (curr[step.prop][0] > step.num) {
					returns.push({ name: step.target, range: structuredClone(curr) });
					curr = null;
					break;
				} else if (curr[step.prop][1] > step.num) {
					returns.push({ name: step.target, range: {...structuredClone(curr), [step.prop]: [step.num + 1, curr[step.prop][1]] } });
					curr[step.prop][1] = step.num + 1;
				}
			}
			else if (step.op === "<") {
				if (curr[step.prop][1] < step.num) {
					returns.push({ name: step.target, range: curr });
					curr = null;
					break;
				} else if (curr[step.prop][0] < step.num) {
					returns.push({ name: step.target, range: {...structuredClone(curr), [step.prop]: [curr[step.prop][0], step.num] } });
					curr[step.prop][0] = step.num;
				}
			}
		}
	}
	return returns;
};
let acc = 0;
/*
let range = (findRange({
	x: [1, 4001],
	m: [1, 4001],
	a: [1, 4001],
	s: [1, 4001],
}, "in"))
range = range.map(x => "AR".includes(x.name) ? x : findRange(x.range, x.name)).flat();
console.dir(range, { depth: null })
*/

let range = findRange({
	x: [1, 4001],
	m: [1, 4001],
	a: [1, 4001],
	s: [1, 4001],
}, "in");

while (!range.every(x => "AR".includes(x.name))) {
	range = range.map(x => "AR".includes(x.name) ? x : findRange(x.range, x.name)).flat();
}
console.log(range.filter(x => x.name === "A").map(x => x.range).map(x => BigInt(x.x[1] - x.x[0]) * BigInt(x.m[1] - x.m[0]) * BigInt(x.a[1] - x.a[0]) * BigInt(x.s[1] - x.s[0])).reduce((l, c) => l + c, 0n));

