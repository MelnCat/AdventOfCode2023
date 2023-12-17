import fs from "fs";
import _ from "lodash"
import { PriorityQueue } from "@datastructures-js/priority-queue";
const data = fs.readFileSync(new URL("data.txt", import.meta.url), "utf8").replaceAll("\r", "");

const lines = data.split("\n");

const grid = lines.map(x=>x.split("").map(x=>+x));

const q = new PriorityQueue((a,b)=>a.d-b.d);

const nodes = grid.flatMap((x,i)=>x.flatMap((y,j)=>
[...Array(7)].flatMap((_,k)=>([{i,j,steps:k+4,dir:[0,-1],d:Infinity,x:+y},{i,j,steps:k+4,dir:[0,1],d:Infinity,x:+y},{i,j,steps:k+4,dir:[1,0],d:Infinity,x:+y},{i,j,steps:k+4,dir:[-1,0],x:+y,d:Infinity}]))))

const idx = nodes.reduce((l,c)=>{
	if (!l[c.i]) l[c.i] = [];
	if (!l[c.i][c.j]) l[c.i][c.j] = [];
	if (!l[c.i][c.j][c.dir[0]]) l[c.i][c.j][c.dir[0]] = [];
	if (!l[c.i][c.j][c.dir[0]][c.dir[1]]) l[c.i][c.j][c.dir[0]][c.dir[1]] = [];
	
	l[c.i][c.j][c.dir[0]][c.dir[1]][c.steps] = c;
	return l;
},{})
q.enqueue({i:0,j:0,dir:[0,0],steps:0,d:0,x:+grid[0][0]});
const visited = new Set();
let p =0;
outer:
console.log(nodes.length)
while (!q.isEmpty()) {
	const last = q.dequeue();
	visited.add(last);
	for (const dir of [[0,-1],[0,1],[1,0],[-1,0]]) {
		if (last.dir[0] === dir[0] && last.dir[1] === dir[1] && last.steps === 10) continue;
		if ((last.dir[0] === -dir[0] && dir[0] !== 0) || (dir[1] !== 0 && last.dir[1] === -dir[1])) continue;
		const change = last.dir[0] === dir[0] && dir[1] === last.dir[1] ? last.dir : [dir[0] * 4,dir[1] * 4];
		const next = idx[last.i+change[0]]?.[last.j+change[1]]?.[dir[0]]?.[dir[1]]?.[dir[0] === last.dir[0] && dir[1] === last.dir[1] ? last.steps+1 : 4];
		if (!next) continue;
		if (visited.has(next)) continue;
		if (last.dir[0] === dir[0] && dir[1] === last.dir[1]) {} else {
		}
		next.d = Math.min(next.d,last.dir[0] === dir[0] && dir[1] === last.dir[1] ? last.d+next.x : 
			last.d+grid[last.i + dir[0]][last.j + dir[1]] +
			grid[last.i + dir[0] * 2][last.j + dir[1] * 2] +
			grid[last.i + dir[0] * 3][last.j + dir[1] * 3] +
			grid[last.i + dir[0] * 4][last.j + dir[1] * 4]);
			//console.log(last, next)
		if (next.i === grid.length - 1 && next.j === grid[0].length - 1) {
			
			console.log(nodes.filter(x=>x.i === next.i && x.j === next.j).map(x=>x.d).filter(x=>isFinite(x)));
		}
		q.remove(x=>x===next)
		q.enqueue(next);
	}
	//console.log(nodes.length, q.size());
}
//console.log(grid.length - 1,grid[0].length - 1)
//console.log(idx[grid.length - 1][grid[0].length - 1].flat(3));
			console.log(Math.min(...nodes.filter(x=>x.i === grid.length - 1 && x.j === grid[0].length - 1).map(x=>x.d).filter(x=>isFinite(x))));