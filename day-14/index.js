import fs from "fs";
import _ from "lodash"
const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8");

const lines = data.split(/\n\r?/).map(x => x.trim().split(""));

const rotated = _.unzip(lines);
const final = [];
const changed = rotated.map(x=>x.join("").split("#").map(x=>x.split("").sort((a,b)=>a==="O"?-1:1).join("")).join("#"))
console.log(changed.map(x=>x.split("").reduce((l,c,i,a)=>(a.length-i) * (c==="O"?1:0)+l,0)).reduce((l,c)=>l+c,0));