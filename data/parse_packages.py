import simplejson as json

with open('packages.txt','r') as f:
    lines = f.readlines()

items = []

current_item = {}

def parse_line(s):
    return s.lstrip().rstrip("\n ").split("|")[::-1]

for i in range(len(lines)):
    if lines[i].startswith(r"\item"):
        current_item = {}
        current_item['title'] = parse_line(lines[i+1])
        current_item['href'] = parse_line(lines[i+2])
        current_item['description'] = parse_line(lines[i+3])
        if i+4 < len(lines) and not lines[i+4].startswith(r"\item"):
            current_item['additional_hrefs'] = parse_line(lines[i+4])[::-1]
        else:
            current_item['additional_hrefs'] = []
        items.append(current_item)

with open('packages.json', 'w',  encoding='utf8') as f:
    json.dump(items,f,indent=4 * ' ', ensure_ascii=False)
