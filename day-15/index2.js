import fs from "fs";
import _ from "lodash"
const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const parts = data.split(",")

let acc = 0;
const boxes = [...Array(256)].map(()=>[])
for (const part of parts) {
	let box = 0;
	const label = part.split(/[-=]/)[0];
	for (let i = 0; i < label.length; i++) {
		const chr = label[i];
		box += chr.charCodeAt(0);
		box *= 17;
		box %= 256;
	}
	console.log(box)
	if (part.includes("=")) {
		const label = part.split("=")[0];
		const power = +part.split("=")[1];
		const exist = boxes[box].find(x=>x.label === label);
		if (exist) {
			exist.power = power;
		} else {
			boxes[box].push({label, power});
		}

	}
	if (part.includes("-")) {
		const label = part.split("-")[0];
		boxes[box] = boxes[box].filter(x=>x.label !== label);
	}
}
console.log(boxes.map((x,i)=>x.map((y, j) => (i + 1) * (j + 1) * y.power).reduce((l,c)=>l+c,0)).reduce((l,c)=>l+c,0))