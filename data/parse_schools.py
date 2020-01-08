import simplejson as json

with open('schools.txt','r') as f:
    lines = f.readlines()

items = []

current_item = {}

def parse_line(s):
    return s.lstrip().rstrip("\n ").split("|")

for i in range(len(lines)):
    if lines[i].startswith(r"\item"):
        current_item = {}
        current_item['title'] = parse_line(lines[i+1])
        current_item['place'] = parse_line(lines[i+2])
        current_item['year'] = parse_line(lines[i+3])
        items.append(current_item)

with open('schools.json', 'w') as f:
    json.dump(items,f,indent=4 * ' ')
