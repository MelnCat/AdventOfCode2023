import fs from "fs";
import _ from "lodash";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const lines = data.split("\n");
const stones = lines.map(x => x.split(" @ ").map(x => x.split(", ").map(y => +y))).map(x => ({ pos: x[0], velocity: x[1] }));

const solve = (a,b,c,d,f,g,h,j) => [
	(j * (a - c) + d * (h - f)) / (d * g - b * j),
	(g * (a - c) + b * (h - f)) / (d * g - b * j)
]

const intersection = (first, second) => {
	const [s, t] = solve(first.pos[0], first.velocity[0], second.pos[0], second.velocity[0], first.pos[1], first.velocity[1], second.pos[1], second.velocity[1]);
	if (s < 0 || t < 0) return null;
	if (isNaN(s) || isNaN(t)) return null;
	return [first.pos[0] + first.velocity[0] * s, first.pos[1] + first.velocity[1] * s, s, t]

}

let acc = 0;
for (const stone of stones) {
	for (const other of stones.slice(stones.indexOf(stone) + 1)) {
		const intersect = intersection(stone, other);
		if (!intersect) continue;
		if (intersect[0] >= 200000000000000 && intersect[0] <= 400000000000000 && intersect[1] >= 200000000000000 && intersect[1] <= 400000000000000) {
			acc++;
			console.log(intersect[2])
		};
	}
}
console.log(acc)