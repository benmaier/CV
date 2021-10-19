import simplejson as json
from datetime import date

with open('press_coverage.json','r') as f:
    data = json.load(f)

def parse_date(d):
    d = d['date-parts'][0]
    d[0] = int(d[0])
    d = date(*d[:3])
    return d

for entry in data:
    #print(entry['notes'])
    #print(entry)
    this = {
                'title': entry['title'],
                'type': entry['type'],
           }
    try:
        this['date'] = parse_date(entry['date'])
    except KeyError as e:
        try:
            this['date'] = parse_date(entry['issued'])
        except KeyError as e:
            this['date'] = parse_date(entry['accessed'])
    try:
        this['href'] = entry['URL']
    except KeyError as e:
        this['href'] = ''

    for publication_key in ['collection-title','container-title','publisher']:
        try:
            this['publication'] = entry[publication_key]
        except KeyError as e:
            pass

    if 'publication' not in this:
        print(entry)
