import fs from "fs";
import _ from "lodash";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const modules = /**
 * @type {({ type: "flipflop", name: string, memory: "on"|"off", targets: string[] } | { type: "conjunction", name: string, memory: { [name: string]: string }, targets: string[]  } | { type: "broadcast", name: string, targets: string[] })[]} })}}
 */ (
	data
		.split("\n")
		.map(x => {
			const [id, targets] = x.split(" -> ");
			const first = id[0];
			/**
			 * @type {"broadcast"|"flipflop"|"conjunction"}
			 */
			const type =
				{
					"%": "flipflop",
					"&": "conjunction",
				}[first] ?? "broadcast";
			return {
				name: type === "broadcast" ? id : id.slice(1),
				type,
				targets: targets.split(", "),
			};
		})
		.map((x, _, a) =>
			x.type === "conjunction"
				? {
						...x,
						memory: Object.fromEntries(
							a
								.filter(y => y.targets.includes(x.name))
								.map(x => [x.name, "low"])
						),
				  }
				: x.type === "flipflop"
				? { ...x, memory: "off" }
				: x
		)
).concat({ name: "button", type: "broadcast", targets: ["broadcaster"]  });

const moduleMap = Object.fromEntries(modules.map(x => [x.name, x]));

/**
 * @type { { name: string, type: string, src: string, memSnap: object }[] }
 */
const signals = [];
const press = () => {
	signals.push({
		name: "button",
		type: "low"
	})
};

let lowNum = 0;
let highNum = 0;
const add = list => {
	for (const signal of list) {
		if (signal.type === "low") lowNum++;
		if (signal.type === "high") highNum++;
	}
	signals.push(...list.map(x=> ({...x})));
};
let iterN = 0;
let found = Object.keys(modules.find(x => x.targets.includes("rx")).memory);
const cycles = Object.fromEntries(found.map(x=>[x,[]]))
const checkSignals = () => {
	while (signals.length) {
		const signal = signals.shift();
		//if (signal.src) console.log(`${signal.src} (${signal.type}) -> ${signal.name}`);
		const module = moduleMap[signal.name];
		if (!module) continue;
		//if (signal.name === "rx") console.log(iterN, signal.type)
		const type = module.type;
		const mods = modules.filter(
			x => x.type === "conjunction" && signal.name in x.memory
		);
		//for (const m of mods) m.memory[signal.name] = signal.type;
		if (type === "flipflop") {
			if (signal.type === "low") {
				if (module.memory === "off") {
					module.memory = "on"
					add(
						module.targets.map(x => ({
							name: x,
							type: "high",
							src: module.name
						}))
					);
				} else if (module.memory === "on") {
					module.memory = "off"
					add(
						module.targets.map(x => ({
							name: x,
							type: "low",
							src: module.name,
						}))
					);
				}
			}
		}
		if (type === "conjunction") {
			 module.memory[signal.src] = signal.type;
			add(
				module.targets.map(x => ({
					name: x,
					type: Object.values(module.memory).every(x => x === "high")
						? "low"
						: "high",
					src: module.name,
				}))
			);
			if (found.includes(signal.name) && !Object.values(module.memory).every(x => x === "high")) cycles[signal.name].push(iterN)
		}
		if (type === "broadcast") {
			add(
				module.targets.map(x => ({
					name: x,
					type: signal.type,
					src: module.name,
				}))
			);
		}
	}
};
let last = {}
for (let i = 0; i < 15000; i++) {
	iterN++;
press();
checkSignals();
if( 0) for (const module of modules) {
	if (module.name === "tq")
	if (module.type === "conjunction") {
		const encoded = Object.entries(module.memory).sort((a,b)=>a[0].localeCompare(a[1])).map(x => ["low", "high"].indexOf(x[1])).join("");
		if (encoded !== last[module.name]) {
			console.log(module.name, encoded, last[module.name])
			last[module.name] = encoded;
		}
	}

}}
console.log(Object.fromEntries(Object.entries(cycles).map(([k,v])=>[k,[v, v.map((x,i,a)=>x-a[i-1])]])))
