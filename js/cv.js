"use strict";

let _CV_LANG = 0;
let _CV_PRINT = true;

class CVBuilder {
  
  constructor(id,jsonpath)
  {
    let self = this;

    fetch(jsonpath)
      .then((response) => {
        return response.json();
      })
      .then((json) => {

        self.data = json;
        self.buildCV();
      });
  }

  buildCV() 
  {
    let data = this.data;
    let order = data.fieldorder;
    let titles = data.fieldnames;
    let content = data.fieldcontent;

    //order = ["academic", "science","education", "additional_working"];

    let cvhtml = '';

    order.forEach(function(section) {
      let title = _T(titles[section]);
      let cvsection = '';

      if (section == "education")
      {
        cvsection = parseTabledSection(title, content[section], parseEducationTableRow);
      }
      else if (section == 'additional_working')
      {
        //cvsection = parseImportantSection(title, content[section], parseImportantEntry);
        cvsection = parseTabledSection(title, content[section], parseEducationTableRow);
      }
      else if (section == 'academic')
      {
        cvsection = parseImportantSection(title, content[section], parseImportantEntry);
      }
      else if (section == 'science')
      {
        cvsection = parseTabledSection(title, content[section], parseScientificEntry);
      }
      else if (section == 'teaching')
      {
        cvsection = parseTabledSection(title, content[section], parseEducationTableRow);
      }
      else if (section == 'voluntary_freetime')
      {
        cvsection = _cv_templates.importantSection.replace("{{ title }}", title);
        let descriptions = '';
        content[section].forEach(function (entry) {
          descriptions += `<p>${_cv_templates.itemDescription.replace("{{ item-description }}", _T(entry.description))}</p>`;
        });
        cvsection = cvsection.replace("{{ entries }}", descriptions);
      }
      else if (section == 'languages')
      {
        cvsection = parseTabledSection(title, content[section], parseScientificEntry);
      }
      else if (section == 'fellowships')
      {
        cvsection = parseTabledSection(title, content[section], parseFellowshipEntry);
      }
      else if (section == 'it')
      {
        cvsection = parseTabledSection(title, content[section], parseITEntry);
      }
      else if (section == 'publications')
      {
        cvsection = parseListSection(title, content[section], parsePublicationEntry);
      }
      else if (section == 'schools')
      {
        //cvsection = parseListSection(title, content[section], parseListSchoolEntry);
        cvsection = parseTabledSection(title, content[section], parseSchoolEntry);
      }
      else if (section == 'talks')
      {
        cvsection = parseListSection(title, content[section], parseTalkEntry);
      }
      else if (section == 'packages')
      {
        cvsection = parseListSection(title, content[section], parsePackageEntry);
      }

      cvhtml += cvsection;
    });

    document.getElementById("cvcontainer").innerHTML = cvhtml;

    //short profile
    let bulletList = '';
    content.profile.forEach(function(item) {
      bulletList += _cv_templates.profileItem.replace("{{ item }}", _T(item));
    });

    let profileHTML = _cv_templates.profile.replace("{{ title }}", _T(titles.profile))
                                       .replace("{{ items }}", bulletList);

    document.getElementById("profilecontainer").innerHTML = profileHTML;
  };
}


//this translates everything according to the desired language 
function _T(entry) {
  if (!Array.isArray(entry))
    return entry;

  if (_CV_LANG >= entry.length)
    return entry[0];
  else
    return entry[_CV_LANG];
}

function parseEducationTableRow(entry) {
    let row = _cv_templates.tableRow;
    let left = _cv_templates.timeRange.replace("{{ time-range }}",_T(entry.date));
    let title = _cv_templates.itemTitle.replace("{{ item-title }}",_T(entry.name));
    let place = _cv_templates.itemPlace.replace("{{ item-place }}",_T(entry.place));
    let desc = _cv_templates.itemDescription.replace("{{ item-description }}",_T(entry.description));
    let right = `${title}<br/>${place}, ${desc}`;
  //console.log(right);
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
}

function parseTabledSection(title, entries, rowparser)
{
  let cvsection = _cv_templates.tabledSection.replace("{{ title }}", title); 
  let rows = '';
  entries.forEach(function(entry) {
    rows += rowparser(entry);
  });
  cvsection = cvsection.replace("{{ table-rows }}", rows);
  return cvsection;
}

function parseUntitledTableSection(entries, rowparser)
{
  let cvsection = _cv_templates.untitledTableSection;
  let rows = '';
  entries.forEach(function(entry) {
    rows += rowparser(entry);
  });
  cvsection = cvsection.replace("{{ table-rows }}", rows);
  return cvsection;
}

function parseImportantSection(title, entries, rowparser)
{
  let cvsection = _cv_templates.importantSection.replace("{{ title }}", title); 
  let rows = '';
  entries.forEach(function(entry,i) {
    if (i>0) {
      rows += '<div style="font-size:16pt;">&nbsp;</div>';
    }
    rows += rowparser(entry);
  });
  cvsection = cvsection.replace("{{ entries }}", rows);
  return cvsection;
}

function parseListSection(title, entries, rowparser)
{
  let cvsection = _cv_templates.listSection.replace("{{ title }}", title); 
  let rows = '';
  entries.forEach(function(entry) {
    rows += rowparser(entry);
  });
  cvsection = cvsection.replace("{{ entries }}", rows);
  return cvsection;
}

function parseImportantEntry(entry) {
    let row = _cv_templates.importantEntry;
    let time = _cv_templates.timeRange.replace("{{ time-range }}",_T(entry.date));
    let title = _cv_templates.itemTitle.replace("{{ item-title }}",_T(entry.name));
    let place = _cv_templates.itemPlace.replace("{{ item-place }}",_T(entry.place));
    let desc = _cv_templates.itemDescription.replace("{{ item-description }}",_T(entry.description));
  //console.log(right);
    row = row.replace("{{ header-left }}", place)
             .replace("{{ header-right }}", time)
             .replace("{{ item-title }}", title)
             .replace("{{ item-description }}", desc)
          ;

    return row;
}

function parseScientificEntry(entry) {
    let row = _cv_templates.tableRow;
    let left = _T(entry.name);
    let right = _cv_templates.itemDescription.replace("{{ item-description }}",_T(entry.description));
  //console.log(right);
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
}

function parseITEntry(entry) {
    let row = _cv_templates.tableRow;
    let left = _T(entry.name);
    let right = entry.items.map(_T).join(", ");
  //console.log(right);
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
}

function parseFellowshipEntry(entry) {
    let row = _cv_templates.tableRow;
    let left = _cv_templates.timeRange.replace("{{ time-range }}",_T(entry.date));
    let right = _cv_templates.itemDescription.replace("{{ item-description }}",_T(entry.name));
  //console.log(right);
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
}

function parsePublicationEntry(entry) {

  let authors = entry.authors.map(function(a){
      let _a = a;
      if (a.includes("B. F. Maier") || a.includes("B. Maier"))
        _a = `<span class="cv-item-title">${_a}</span>`;
      _a = _cv_templates.paperAuthor.replace("{{ author }}", _a);
      return _a;
    
    }).join(", ");
  let title = _cv_templates.paperTitle.replace("{{ title }}", _T(entry.title));
  let additional = _cv_templates.paperAdd.replace("{{ additional }}", _T(entry.additional));

  let arxivlink = "https://arxiv.org/abs/" + entry.arxiv;
  let doilink = "https://doi.org/" + entry.doi;
  let arxiv = "arXiv:" + _cv_templates.paperLink.replace("{{ linktext }}", entry.arxiv)
                                                .replace("{{ href }}", arxivlink);
  let doi = "doi:" + _cv_templates.paperLink.replace("{{ linktext }}", entry.doi)
                                                .replace("{{ href }}", doilink);

  if (entry.hyperlink != "")
  {
    title = _cv_templates.paperLink.replace("{{ linktext }}", title)
                                   .replace("{{ href }}", entry.hyperlink);
  }
  else if (entry.arxiv != "")
  {

    title = _cv_templates.paperLink.replace("{{ linktext }}", title)
                                   .replace("{{ href }}", arxivlink);
  }
  else if (entry.doi != "")
  {
    title = _cv_templates.paperLink.replace("{{ linktext }}", title)
                                   .replace("{{ href }}", doilink);
  }


  let links = ""
  if (entry.arxiv != "")
  {
    links += " " + arxiv + ".";
  }

  if (entry.doi != "")
  {
    links += " " + doi + ".";
  }

  let paper = _cv_templates.paperEntry.replace("{{ authors }}", authors)
                                      .replace("{{ year }}", entry.year)
                                      .replace("{{ title }}", title)
                                      .replace("{{ additional }}", additional) 
                                      .replace("{{ links }}", links) 
      ;

  let item = _cv_templates.listSectionItem.replace("{{ item }}", paper);

  return item;
}

function parseListSchoolEntry(entry) {

  let title = _cv_templates.schoolTitle.replace("{{ title }}", _T(entry.title));
  let place = _cv_templates.schoolPlace.replace("{{ place }}", _T(entry.place));


  let school = _cv_templates.schoolEntry.replace("{{ title }}", title)
                                        .replace("{{ place }}", place)
                                        .replace("{{ year }}", _T(entry.year))
      ;
  let item = _cv_templates.listSectionItem.replace("{{ item }}", school);
  return item;
}

function parseSchoolEntry(entry) {
    let row = _cv_templates.tableRow;
    let left = _cv_templates.timeRange.replace("{{ time-range }}",_T(entry.year));
    let title = _cv_templates.itemTitle.replace("{{ item-title }}",_T(entry.title));
    let place = _cv_templates.itemPlace.replace("{{ item-place }}",_T(entry.place));
    let desc = _cv_templates.itemDescription.replace("{{ item-description }}","");
    let right = `${title}<br/>${place}`;
  //console.log(right);
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
}

function parseTalkEntry(entry) {
  let title = _cv_templates.itemTitle.replace("{{ item-title }}", _T(entry.title));
  let place = _cv_templates.itemPlace.replace("{{ item-place }}", _T(entry.place));
  let event = _cv_templates.itemDescription.replace("{{ item-description }}", _T(entry.event));


  let talk = _cv_templates.talkEntry.replace("{{ title }}", title)
                                        .replace("{{ place }}", place )
                                        .replace("{{ event }}", event )
                                        .replace("{{ year }}", _T(entry.year) )
      ;
  let item = _cv_templates.listSectionItem.replace("{{ item }}", talk);
  return item;
}

function parsePackageEntry(entry) {
  let title = _cv_templates.itemTitle.replace("{{ item-title }}", _T(entry.title));
  let desc = _cv_templates.itemDescription.replace("{{ item-description }}", _T(entry.description));
  let href = _cv_templates.packageHREF.replace(/{{ href }}/g, entry.href); //replace all (/g for globally)

  let addHREFs = "";
  if (entry.additional_hrefs.length > 0){
    if (_CV_LANG == 0)
      addHREFs += ", see also: ";
    else
      addHREFs += ", siehe auch: ";
  }
  addHREFs += entry.additional_hrefs.map(function(h){
    return _cv_templates.packageHREF.replace(/{{ href }}/g, h);
  }).join(", ");

  let pack = _cv_templates.packageEntry.replace("{{ title }}", title)
                                        .replace("{{ description }}", desc)
                                        .replace("{{ href }}", href )
      ;
  pack += addHREFs;
  let item = _cv_templates.listSectionItem.replace("{{ item }}", pack);
  return item;
}
