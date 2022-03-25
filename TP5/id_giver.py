import json
import sys
import re

with open(sys.argv[1]) as f:
    c = json.load(f)

for i, item in enumerate(c['musicas']):
    item.setdefault('id', i)

with open(sys.argv[1], "w") as f:
    json.dump(c, f, indent=2, ensure_ascii=False)