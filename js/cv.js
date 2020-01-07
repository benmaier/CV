"use strict";

let LANG = 0;

//this translates everything according to the 
function T(entry) {
  if (!Array.isArray(entry))
    return entry;

  if (LANG >= entry.length)
    return entry[0];
  else
    return entry[LANG];
}

fetch('data/cv_content.json')
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    console.log(myJson);
    buildCV(myJson);

  });

function parseEducationTableRow(entry) {
    let row = templates.tableRow;
    let left = templates.timeRange.replace("{{ time-range }}",T(entry.date));
    let title = templates.itemTitle.replace("{{ item-title }}",T(entry.name));
    let place = templates.itemPlace.replace("{{ item-place }}",T(entry.place));
    let desc = templates.itemDescription.replace("{{ item-description }}",T(entry.description));
    let right = `${title}<br/>${place}, ${desc}`;
  //console.log(right);
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
}

function parseTabledSection(title, entries, rowparser)
{
  let cvsection = templates.tabledSection.replace("{{ title }}", title); 
  let rows = '';
  entries.forEach(function(entry) {
    rows += rowparser(entry);
  });
  cvsection = cvsection.replace("{{ table-rows }}", rows);
  return cvsection;
}

function parseUntitledTableSection(entries, rowparser)
{
  let cvsection = templates.untitledTableSection;
  let rows = '';
  entries.forEach(function(entry) {
    rows += rowparser(entry);
  });
  cvsection = cvsection.replace("{{ table-rows }}", rows);
  return cvsection;
}

function parseImportantSection(title, entries, rowparser)
{
  let cvsection = templates.importantSection.replace("{{ title }}", title); 
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

function parseImportantEntry(entry) {
    let row = templates.importantEntry;
    let time = templates.timeRange.replace("{{ time-range }}",T(entry.date));
    let title = templates.itemTitle.replace("{{ item-title }}",T(entry.name));
    let place = templates.itemPlace.replace("{{ item-place }}",T(entry.place));
    let desc = templates.itemDescription.replace("{{ item-description }}",T(entry.description));
  //console.log(right);
    row = row.replace("{{ header-left }}", place)
             .replace("{{ header-right }}", time)
             .replace("{{ item-title }}", title)
             .replace("{{ item-description }}", desc)
          ;

    return row;
}

function parseScientificEntry(entry) {
    let row = templates.tableRow;
    let left = T(entry.name);
    let right = templates.itemDescription.replace("{{ item-description }}",T(entry.description));
  //console.log(right);
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
}

function parseITEntry(entry) {
    let row = templates.tableRow;
    let left = T(entry.name);
    let right = entry.items.map(T).join(", ");
  //console.log(right);
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
}

function parseFellowshipEntry(entry) {
    let row = templates.tableRow;
    let left = templates.timeRange.replace("{{ time-range }}",T(entry.date));
    let right = templates.itemDescription.replace("{{ item-description }}",T(entry.name));
  //console.log(right);
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
}



function buildCV(data) {
  let order = data.fieldorder;
  let titles = data.fieldnames;
  let content = data.fieldcontent;

  //order = ["academic", "science","education", "additional_working"];

  let cvhtml = '';

  order.forEach(function(section) {
    let title = T(titles[section]);
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
      cvsection = templates.importantSection.replace("{{ title }}", title);
      let descriptions = '';
      content[section].forEach(function (entry) {
        descriptions += `<p>${templates.itemDescription.replace("{{ item-description }}", T(entry.description))}</p>`;
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

    cvhtml += cvsection;
  });

  document.getElementById("cvcontainer").innerHTML = cvhtml;
};
