import networkx as nx
import json
import os
script_dir = os.path.dirname(__file__)
G = nx.Graph()
"""
G.add_nodes_from([0,  1,  2, 3,  4,  5,
   6,  7,  8, 9, 10, 11,
  12, 13, 14])
G.add_edges_from([
  [ 0, 1 ],  [ 0, 2 ],   [ 0, 3 ],
  [ 4, 5 ],  [ 4, 6 ],   [ 4, 7 ],
  [ 2, 8 ],  [ 9, 10 ],  [ 9, 3 ],
  [ 9, 11 ], [ 9, 12 ],  [ 1, 2 ],
  [ 1, 12 ], [ 1, 8 ],   [ 12, 2 ],
  [ 12, 8 ], [ 6, 7 ],   [ 6, 8 ],
  [ 6, 3 ],  [ 10, 3 ],  [ 13, 0 ],
  [ 13, 8 ], [ 13, 12 ], [ 13, 2 ],
  [ 3, 11 ], [ 7, 11 ],  [ 14, 10 ],
  [ 14, 9 ], [ 14, 7 ],  [ 14, 4 ],
  [ 5, 10 ], [ 5, 11 ],  [ 5, 7 ]
])
"""

G.add_nodes_from(json.loads(open(os.path.join(script_dir, "a"), "r").read()))
G.add_edges_from(json.loads(open(os.path.join(script_dir, "b"), "r").read()))

foo = nx.connectivity.minimum_edge_cut(G)

with open(os.path.join(script_dir, "c"), "w") as f:
	f.write(json.dumps([list(a) for a in foo]))

print(os.popen(f"node {os.path.join(script_dir, 'index.js')}").read())