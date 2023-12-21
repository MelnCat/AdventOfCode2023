import fs from "fs";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const grid = data.split("\n").map(x => x.split(""));

const start = [
	grid.findIndex(x => x.includes("S")),
	grid.find(x => x.includes("S")).indexOf("S"),
];

const map = fs.existsSync("./data221.json") ? JSON.parse(fs.readFileSync("./data221.json", "utf8")) : {};
let list = [];
let plots = [start];
let seen = new Set();
if (!fs.existsSync("./data221.json")) {for (let i = 0; i < 2000; i++) {
	let toAdd = [];
	for (const plot of plots) {
		for (const adj of [
			[0, 1],
			[1, 0],
			[0, -1],
			[-1, 0],
		]) {
			const newPlot = [plot[0] + adj[0], plot[1] + adj[1]];
			const mapPoint = [
				newPlot[0] % grid.length,
				newPlot[1] % grid[0].length,
			];
			const mapPointReal = [
				mapPoint[0] < 0 ? mapPoint[0] + grid.length : mapPoint[0],
				mapPoint[1] < 0 ? mapPoint[1] + grid[0].length : mapPoint[1],
			];

			if (
				grid[mapPointReal[0]]?.[mapPointReal[1]] === "." ||
				grid[mapPointReal[0]]?.[mapPointReal[1]] === "S"
			) {
				if (seen.has(newPlot.join(","))) continue;
				map[newPlot.join(",")] = i;
				seen.add(newPlot.join(","));
				toAdd.push(newPlot);
			}
		}
	}
	plots = toAdd;
}
fs.writeFileSync("./data221.json", JSON.stringify(map))};
let n = 26501365;
const mod = (n + 1) % 2;/*
console.log(
	Object.values(map)
		.filter(x => x % 2 === 1)
		.filter(x => x <= n).length
);*/

let map2 = {};
let acc = 0n;
const predict = (known, di, dj) => {
	if (di <= 3 && di >= -3) {
		if (known[di]?.[dj] !== undefined) return known[di+","+dj];
		const closest = dj < 0 ? known[di+","+-3] : known[di+","+3];
		const d = grid.length;
		return closest + (Math.abs(dj) - 3) * d;
	}
	if (dj <= 3 && dj >= -3) {
		if (known[di]?.[dj] !== undefined) return known[di+","+dj];
		const closest = di < 0 ? known[-3+","+dj] : known[3+","+dj];
		const d = grid.length;
		return closest + (Math.abs(di) - 3) * d;
	}
	const closestPt = [di < 3 ? -3 : 3, dj < 3 ? -3 : 3];
	const closest = known[closestPt[0]+","+closestPt[1]];
	const d = grid.length;
	return closest + (Math.abs(di) - 3) * d + (Math.abs(dj) - 3) * d;
};
const findDj = (known, di, max) => {
	const d = grid.length;
	if (Math.abs(di) <= 3) {
		const closestLeft = known[di+","+-3];
		const closestRight = known[di+","+3];
		return [
			Math.min(Math.floor((closestLeft - 3 * d - max) / d), -3),
			Math.max(Math.ceil((-closestRight + 3 * d + max) / d), 3),
		];
	}
	const closestPtLeft = [di < 3 ? -3 : 3, -3];
	const closestLeft = known[closestPtLeft[0]+","+closestPtLeft[1]];
	const hCo = (Math.abs(di) - 3) * d;
	const tLeft = Math.floor((closestLeft - 3 * d + hCo - max) / d);
	const closestPtRight = [di < 3 ? -3 : 3, 3];
	const closestRight = known[closestPtRight[0]+","+closestPtRight[1]];
	const tRight = Math.ceil((closestRight - 3 * d + hCo - max) / -d);
	return [tLeft, tRight];
};

for (let i = 0; i < grid.length; i++) {
	for (let j = 0; j < grid[0].length; j++) {
		if (grid[i][j] !== "." && grid[i][j] !== "S") continue;
		console.log(i,j)
		const first = map[`${i},${j}`];
		if (first === undefined) continue;
		let known = {};
		let l = 0n;
		for (let v = -3; v <= 3; v++) {
			for (let w = -3; w <= 3; w++) {
				known[v+","+w] =
					map[`${i + grid.length * v},${j + grid[0].length * w}`];
					if (known[v+","+w] === undefined) throw new Error("e")
			}
		}
		let di = 0;
		while (true) {
			const predicted = findDj(known, di, n);
			if (
				isNaN(predicted[0]) ||
				isNaN(predicted[1]) ||
				predicted[1] < predicted[0]
			)
				break;
			let first2;
			for (let dj = predicted[0]; dj <= predicted[1]; dj++) {
				const p = predict(known, di, dj);
				if (p <= n) {
					first2 = dj;
					break;
				}
			}
			let last;
			for (let dj = predicted[1]; dj >= predicted[0]; dj--) {
				const p = predict(known, di, dj);
				if (p <= n) {
					last = dj;
					break;
				}
			}
			const plom = isNaN(first2) || isNaN(last) ? 0 : predict(known, di, first2) % 2 === mod ? (Math.ceil((last - first2 + 1) / 2)) : Math.floor(((last - first2 + 1) / 2));
			di++;
			if (!isNaN(plom)) l += BigInt(plom);
		}
		di = -1;
		while (true) {
			const predicted = findDj(known, di, n);
			if (
				isNaN(predicted[0]) ||
				isNaN(predicted[1]) ||
				predicted[1] < predicted[0]
			)
				break;
			let first2;
			for (let dj = predicted[0]; dj <= predicted[1]; dj++) {
				const p = predict(known, di, dj);
				if (p <= n) {
					first2 = dj;
					break;
				}
			}
			let last;
			for (let dj = predicted[1]; dj >= predicted[0]; dj--) {
				const p = predict(known, di, dj);
				if (p <= n) {
					last = dj;
					break;
				}
			}
			const plom = isNaN(first2) || isNaN(last) ? 0 : predict(known, di, first2) % 2 === mod ? (Math.ceil((last - first2 + 1) / 2)) : Math.floor(((last - first2 + 1) / 2));
			if (!isNaN(plom)) l += BigInt(plom);
			di--;
		}
		
		acc += BigInt(l);
	}
}
console.log(acc);
console.log(acc);
console.log(acc);