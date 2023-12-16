import fs from "fs";
import _ from "lodash"
const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split(/\n\r?/).map(x => x.trim().split(""));

const rotated = _.unzip(lines);
const final = [];
const rotate = (direction, m) => {
	if (direction === "N") {
		return m.map(x=>x.join("").split("#").map(x=>x.split("").sort((a,b)=>a==="O"?-1:1).join("")).join("#").split(""));
	}
	if (direction === "S") {
		return m.map(x=>x.join("").split("#").map(x=>x.split("").sort((a,b)=>a==="O"?1:-1).join("")).join("#").split(""));
	}
	if (direction === "E") {
		return _.unzip(_.unzip(m).map(x=>x.join("").split("#").map(x=>x.split("").sort((a,b)=>a==="O"?1:-1).join("")).join("#").split("")));
	}
	if (direction === "W") {
		return _.unzip(_.unzip(m).map(x=>x.join("").split("#").map(x=>x.split("").sort((a,b)=>a==="O"?-1:1).join("")).join("#").split("")));
	}
}
const sum = m => m.map(x=>x.reduce((l,c,i,a)=>(a.length-i) * (c==="O"?1:0)+l,0)).reduce((l,c)=>l+c,0);
let m = rotated;
for(let i = 0; i< 1300; i++) {
	m = rotate("N", m);
	m = rotate("W", m);
	m = rotate("S", m);
	m = rotate("E", m);
	console.log(i + 1, "->", sum(m))
}
/*
`1000 -> 100025
1001 -> 100043
1002 -> 100071
1003 -> 100084
1004 -> 100084
1005 -> 100086
1006 -> 100084
1007 -> 100086
1008 -> 100086
1009 -> 100079
1010 -> 100064
1011 -> 100047
1012 -> 100034
1013 -> 100024
1014 -> 100016
1015 -> 100008
1016 -> 100011`.map(x=>x.split(" -> ")[1])
*/

//['100025', '100043', '100071', '100084', '100084', '100086', '100084', '100086', '100086', '100079', '100064', '100047', '100034', '100024', '100016', '100008', '100011'][(1000000000-1000)%17]