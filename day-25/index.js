import fs from "fs";
import _ from "lodash";
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
const canReachAll = (connections, start = components[0].name) => {
	const visited = new Set([start]);
	const queue = [start];
	while (queue.length > 0) {
		const current = queue.shift();
		const connected = connections.filter(x => x.from === current).map(x => x.to).concat(connections.filter(x => x.to === current).map(x => x.from));
		for (const found of connected) {
			if (visited.has(found)) continue;
			visited.add(found);
			queue.push(found);
		}
	}
	return visited;
}

const cuts = JSON.parse(fs.readFileSync(new URL("c", import.meta.url), "utf8"));
const excl = (connections.filter(x=>cuts.some(y=>y.includes(names.indexOf(x.from)) && y.includes(names.indexOf(x.to)))))

			const newConnections = connections.filter(x => !excl.includes(x));
			if (canReachAll(newConnections).size !== components.length) {
				const first = canReachAll(newConnections);
				const second = canReachAll(newConnections, components.find(x => !first.has(x.name)).name);
				console.log(first.size, second.size);
			}