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

const histories = lines.map(x => x.split(" ").map(x => +x))

const diff = arr => arr.map((x, i) => arr[i] - arr[i - 1]).slice(1);

const C = (n, r) => {
	if (r > n - r) r = n - r;
	let ans = 1;
	for (let i = 1; i <= r; i++) {
		ans *= n - r + i;
		ans /= i;
	}
	return ans;
}

const all = []
for (const history of histories) {
	const diffs = diff(history);
	let h = history;
	let i = 0;
	let lens = []
	while (!h.every(x => x === h[0])) {
		lens.push(h)
		h = diff(h);
		i++;
	};
	lens.push(h)
	for (let i = lens.length - 1 ; i >= 0; i--) {
		lens[i-1]?.push(lens[i-1].at(-1) + lens[i].at(-1))
	}
	all.push(lens)
	//console.log(h, i, history.at(-1) + C(history.length - 1, i - 1) * h.at(-1))
}
console.log(all.map(x=>x[0].at(-1)).reduce((l,c)=>l+c))