import fs from "fs";
import _ from "lodash";
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

let acc = 0;
`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;
const bar = x => {
	return x
		.trim()
		.split(/\s+/)
		.map(x => BigInt(x));
};
const cheese = x => {
	if (x.length !== 3) throw x;
	return { dest: x[0], src: x[1], len: x[2] };
};
const seeds = lines[0]
	.split(": ")[1]
	.trim()
	.split(/\s+/)
	.map(x => BigInt(x));
const seedToSoil = lines
	.join("\n")
	.match(/seed\-to\-soil map:\r\n([^]+?)\r\n\r\n/m)[1]
	.split("\n")
	.map(x => bar(x))
	.map(x => cheese(x));
const soilToFertilizer = lines
	.join("\n")
	.match(/soil\-to\-fertilizer map:\r\n([^]+?)\r\n\r\n/m)[1]
	.split("\n")
	.map(x => bar(x))
	.map(x => cheese(x));
const fertilizerToWater = lines
	.join("\n")
	.match(/fertilizer\-to\-water map:\r\n([^]+?)\r\n\r\n/m)[1]
	.split("\n")
	.map(x => bar(x))
	.map(x => cheese(x));
const waterToLight = lines
	.join("\n")
	.match(/water\-to\-light map:\r\n([^]+?)\r\n\r\n/m)[1]
	.split("\n")
	.map(x => bar(x))
	.map(x => cheese(x));
const lightToTemperature = lines
	.join("\n")
	.match(/light\-to\-temperature map:\r\n([^]+?)\r\n\r\n/m)[1]
	.split("\n")
	.map(x => bar(x))
	.map(x => cheese(x));
const temperatureToHumidity = lines
	.join("\n")
	.match(/temperature\-to\-humidity map:\r\n([^]+?)\r\n\r\n/m)[1]
	.split("\n")
	.map(x => bar(x))
	.map(x => cheese(x));
const humidityToLocation = lines
	.join("\n")
	.match(/humidity\-to\-location map:\r\n([^]+)/m)[1]
	.split("\n")
	.map(x => bar(x))
	.map(x => cheese(x));
/**
 *
 * @param {typeof temperatureToHumidity} map
 * @param {bigint} src
 * @returns
 */
const conv = (map, src) => {
	const found = map.filter(x => x.src <= src && src < x.src + x.len);
	if (found.length > 1) throw new 2();
	if (src < found[0]?.src) throw new 3();
	if (src >= found[0]?.src + found[0]?.len) throw new 3();
	return found[0] !== undefined ? found[0].dest + src - found[0].src : src;
};
/**
 *
 * @param  {...bigint} args
 * @returns
 */
const bigIntMax = (...args) => args.reduce((m, e) => (e > m ? e : m));
/**
 *
 * @param  {...bigint} args
 * @returns
 */
const bigIntMin = (...args) => args.reduce((m, e) => (e < m ? e : m));

const seedRanges = _.chunk(seeds, 2);
/**
 *
 * @param {typeof seedToSoil} map
 * @returns {(ranges: [bigint, bigint][]) => [bigint, bigint][]}
 */
const doRange = map => ranges => {
	/**
	 * @type {[bigint, bigint][]}
	 */
	const outRanges = [];
	for (const [start, end] of ranges) {
		const found = map
			.filter(x => x.src < end && start < x.src + x.len)
			.sort((a, b) => a.src > b.src ? 1 : -1);
		let last = start-1n;
		for (const f of found) {
			const newRange = [
				bigIntMax(f.src, start),
				bigIntMin(f.src + f.len - 1n, end - 1n),
			].map(x => conv([f], x));
			const dist = f.src - last;
			if (dist > 1n) outRanges.push([last + 1n, f.src - 1n]);
			outRanges.push([newRange[0], newRange[1] + 1n]);
			last = f.src + f.len - 1n;
		}
		if (last < end - 1n) outRanges.push([last + 1n, end]);
	}
	return outRanges;
};
const pipe = (x, ...fns) => fns.reduce((l, c) => c(l), x);
console.log(seedRanges.map(x => [x[0], x[0] + x[1]]))
console.log(pipe(seedRanges.map(x => [x[0], x[0] + x[1]]),
	doRange(seedToSoil),/*
	doRange(soilToFertilizer),
	doRange(fertilizerToWater),
	doRange(waterToLight),
	doRange(lightToTemperature),
	doRange(temperatureToHumidity),
	doRange(humidityToLocation)*/
	)
);
console.log(bigIntMin(...pipe(seedRanges.map(x => [x[0], x[0] + x[1]]),
doRange(seedToSoil),
doRange(soilToFertilizer),
doRange(fertilizerToWater),
doRange(waterToLight),
doRange(lightToTemperature),
doRange(temperatureToHumidity),
doRange(humidityToLocation)
).map(x=>x[0])))
/*
console.log(
	(all)
	.map(x => conv(soilToFertilizer, x))
	.map(x => conv(fertilizerToWater, x))
.map(x => conv(waterToLight, x))
.map(x => conv(lightToTemperature, x))
.map(x => conv(temperatureToHumidity, x))
.map(x => conv(humidityToLocation, x))

.reduce((l,c)=>l>c?c:l, 100000100000100000100000100000100000n))
*/
