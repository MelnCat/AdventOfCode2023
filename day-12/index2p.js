import fs from "fs";
import child_process from "child_process";
import {fileURLToPath} from "url"
import _ from "lodash";
const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split(/\n\r?/).map(x => x.trim());
let acc = []
for (const line of _.chunk(lines, 50)) {
	const fork = child_process.fork(fileURLToPath(new URL("index2.js", import.meta.url)), [line.join("/")], { stdio: "pipe"  });
	fork.stdout.on("data", data => {
		const str = data.toString();
		if (!isNaN(str)) {
			console.log(+str);
			acc.push(+str);
			fs.writeFileSync("data2.txt", JSON.stringify(acc));
		};
	});

}