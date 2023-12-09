import fs from "fs";
/**
 *
 * @param {number} length
 * @param {number} start
 * @returns
 */
const range = (length, start) =>
	Array(length)
		.fill(0)
		.map((_, i) => start + i);

/**
 *
 * @param {number} i
 * @param {number} j
 * @returns
 */
const adjacent = (i, j) => [
	[i - 1, j - 1],
	[i - 1, j],
	[i - 1, j + 1],
	[i, j - 1],
	[i, j + 1],
	[i + 1, j - 1],
	[i + 1, j],
	[i + 1, j + 1],
];

const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split("\n");

const times = lines[0]
	.split(":")[1]
	.trim()
	.split(/\s+/)
	.map(x => +x);
const distances = lines[1]
	.split(":")[1]
	.trim()
	.split(/\s+/)
	.map(x => +x);
const races = times.map((x, i) => ({ time: x, distance: distances[i] }));
let acc = 1;
function solveQuadraticEquation(a, b, c) {
	var d = b * b - 4 * a * c,
		ds,
		mbmds,
		mbpds;
	if (a === 0) {
	  // linear equation
	  if (b === 0) {
		if (c === 0) {
		  // all values of x are ok.
		  return [undefined, undefined, undefined];
		} else {
		  return [];
		}
	  } else {
		return [-c / b];
	  }
	}
  
	if (d < 0) {
	  return [];
	} else if (d === 0) {
	  return [-b / (2 * a)];
	}
  
	ds = Math.sqrt(d);
	if (b >= 0) {
	  mbmds = -b - ds;
	  return [mbmds / (2 * a), 2 * c / mbmds];
	} else {
	  mbpds = -b + ds;
	  return [2 * c / mbpds, mbpds / (2 * a)];
	}
  }
  const start = Date.now()
for (const race of races) {
	const [high, low] = solveQuadraticEquation(-1, race.time, -race.distance)
	const higherest = Math.floor(high);
	const lowerst = Math.ceil(low);
	console.log(
		(higherest === high ? -1 : 0) + (lowerst === low ? -1 : 0) + (higherest - lowerst + 1)
	);
	acc *=((higherest === high ? -1 : 0) + (lowerst === low ? -1 : 0) + (higherest - lowerst + 1))
}
console.log(acc);
console.log(Date.now() - start)