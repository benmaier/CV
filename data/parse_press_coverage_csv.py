import simplejson as json
from datetime import date, datetime
from babel.dates import format_date
import csv

def parse_notes(notes):
    entries = notes.split('</p>')
    entries = [ note.rstrip(' ').lstrip('<p> ') for note in entries  if note.replace(' ','') != '']
    this = {}
    for entry in entries:
        _key_val = entry.split(':')
        key_val = []
        for s in _key_val:
            key_val.append(s.rstrip(' ').lstrip(' '))
        try:
            val = float(key_val[1])
        except ValueError as e:
            val = key_val[1]
        this[key_val[0]] = val

    return this


types = {
            'newspaperArticle': ['newspaper article', 'Zeitungsartikel'],
            'magazineArticle': ['magazine article', 'Zeitschriftenartikel'],
            'radioBroadcast': ['radio broadcast', 'Radiosendung'],
            'tvBroadcast': ['TV broadcast','TV-Sendung'],
            'podcast': ['podcast', 'Podcast'],
        }

def format_month(d):
    months = []
    for locale in ['en', 'de_DE']:
        months.append(format_date(d,'MMM',locale=locale))
    return months



with open('press_coverage.csv','r') as f:
    reader = csv.DictReader(f)
    rows = []
    for entry in reader:
        this = {
                    'title': entry['Title'],
                    'type': types[entry['Item Type']],
                    'href': entry['Url'],
               }
        d = entry["Date"]
        if entry["Date"] == "":
            d = entry['Date Added']
        d = d[:10]
        d = datetime.strptime(d,"%Y-%m-%d").date()
        this['year'] = d.year
        this['month'] = format_month(d)
        this['month_numeric'] = d.month
        this['day'] = d.day

        publication = entry['Publication Title']
        if publication == '':
            publication = entry['Series Title']
        if publication == '':
            publication = entry['Publisher']
        this['publication'] = publication

        this.update(parse_notes(entry['Notes']))
        this['important'] = this['score'] >= 20

        rows.append(this)

rows = sorted(rows, key=lambda x: (-x['score'],-x['year'],-x['month_numeric']))

with open('parsed_press_coverage.json','w') as f:
    json.dump(rows, f, indent=4)
