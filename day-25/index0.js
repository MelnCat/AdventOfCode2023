import fs from "fs";
import _ from "lodash";
import fmc from "minimum-cut";
import child_process from "child_process";
import { fileURLToPath } from "url";
const data = fs
	.readFileSync(new URL("data.txt", import.meta.url), "utf8")
	.replaceAll("\r", "");

const lines = data.split("\n");
const connections = lines
	.map(x => x.split(": "))
	.map(x => ({ name: x[0], connected: x[1].split(" ") }))
	.flatMap(x => x.connected.map(y => ({ from: x.name, to: y })));
const components = [...new Set(connections.flatMap(x => [x.from, x.to]))].map(
	x => ({
		name: x,
		connected: connections
			.filter(y => y.from === x)
			.map(x => x.to)
			.concat(connections.filter(y => y.to === x).map(x => x.from)),
	})
);
const names = components.map(x => x.name);
fs.writeFileSync(
	new URL("a", import.meta.url),
	JSON.stringify(names.map((x, i) => i))
);
fs.writeFileSync(
	new URL("b", import.meta.url),
	JSON.stringify(
		connections.map(x => [names.indexOf(x.from), names.indexOf(x.to)])
	)
);

const sp = child_process.spawn(`python`, [fileURLToPath(new URL("index.py", import.meta.url))]);
sp.stdout.on("data", x => console.log(x.toString()));