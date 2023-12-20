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
	let toFlush = [];
	signals.push(...list.map(x=> ({...x, toFlush, memSnap: structuredClone(moduleMap[x.name]?.memory)})), () => toFlush.map(x => x()));
};
const checkSignals = () => {
	while (signals.length) {
		const signal = signals.shift();
		if (typeof signal === "function") signal();
		//if (signal.src) console.log(`${signal.src} (${signal.type}) -> ${signal.name}`);
		const module = moduleMap[signal.name];
		if (!module) continue;
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
for (let i = 0; i < 1000; i++) {
press();
checkSignals();}
console.log(lowNum, highNum, lowNum * highNum)
lowNum = 0;
highNum = 0;