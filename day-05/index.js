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
}
const cheese = x =>{
	if (x.length !== 3) throw(x);
	return  ({ dest: x[0], src: x[1], len: x[2] });
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
	.map(x =>
		bar(x)
	)
	.map(x => cheese(x));
const soilToFertilizer = lines
	.join("\n")
	.match(/soil\-to\-fertilizer map:\r\n([^]+?)\r\n\r\n/m)[1]
	.split("\n")
	.map(x =>
		bar(x)
	)
	.map(x => cheese(x));
const fertilizerToWater = lines
	.join("\n")
	.match(/fertilizer\-to\-water map:\r\n([^]+?)\r\n\r\n/m)[1]
	.split("\n")
	.map(x =>
		bar(x)
	)
	.map(x => cheese(x));
const waterToLight = lines
	.join("\n")
	.match(/water\-to\-light map:\r\n([^]+?)\r\n\r\n/m)[1]
	.split("\n")
	.map(x =>
		bar(x)
	)
	.map(x => cheese(x));
const lightToTemperature = lines
	.join("\n")
	.match(/light\-to\-temperature map:\r\n([^]+?)\r\n\r\n/m)[1]
	.split("\n")
	.map(x =>
		bar(x)
	)
	.map(x => cheese(x));
const temperatureToHumidity = lines
	.join("\n")
	.match(/temperature\-to\-humidity map:\r\n([^]+?)\r\n\r\n/m)[1]
	.split("\n")
	.map(x =>
		bar(x)
	)
	.map(x => cheese(x));
const humidityToLocation = lines
	.join("\n")
	.match(/humidity\-to\-location map:\r\n([^]+)/m)[1]
	.split("\n")
	.map(x =>
		bar(x)
	)
	.map(x => cheese(x));
/**
 *
 * @param {typeof seedToSoil} map
 * @param {bigint} src
 * @returns
 */
const conv = (map, src) => {
	const found = map.filter(x => x.src <= src && src < x.src + x.len);
	if (found.length > 1) throw new 2;
	if (src < found[0]?.src) throw new 3;
	if (src >= found[0]?.src + found[0]?.len) throw new 3;
	return found[0] !== undefined ? found[0].dest + src - found[0].src : src;
};


console.log(
	(seeds.map(x => conv(seedToSoil, x)))
	.map(x => conv(soilToFertilizer, x))
	.map(x => conv(fertilizerToWater, x))
.map(x => conv(waterToLight, x))
.map(x => conv(lightToTemperature, x))
.map(x => conv(temperatureToHumidity, x))
.map(x => conv(humidityToLocation, x))

.reduce((l,c)=>l>c?c:l, 100000100000100000100000100000100000n))
