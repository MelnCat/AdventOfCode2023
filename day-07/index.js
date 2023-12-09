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

const str = `A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, 2`.split(", ")
const hands = lines.map(x => x.split(" ")).map(x => ({ hand: x[0].split(""), bid: +x[1] }));

/**
 * 
 * @param {(typeof hands)[number]} hand 
 */
const rateFirst = hand => {
	if (hand.hand.every(x => x === hand.hand[0])) return 100000;
	const counts = hand.hand.reduce((l,c)=>(l[c]?l[c]++:l[c]=1,l),{});
	const values = Object.values(counts);
	const max = Math.max(...values);
	if (max === 4) return 20000000;
	if (max === 3 && values.length === 2) return 30000000;
	if (max === 3) return 40000000;
	if (max === 2 && values.length === 3) return 50000000;
	if (max === 2) return 60000000;
	return 70000000;
}
const rateSecond = hand => {
	let i = 0;
	let j = 0;
	for (const char of hand.hand) {
		i += (str.length) ** (5 - j) * (str.indexOf(char))
		j++;
	};
	return i;
}
const rate = hand => rateFirst(hand) + rateSecond(hand);
const sorted = hands.slice().sort((a, b) => rate(b) - rate(a));
console.log(sorted.reduce((l,c,i)=>l + (i + 1) * c.bid,0))