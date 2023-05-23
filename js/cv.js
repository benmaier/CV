"use strict";

let _CV_LANG = 0;
let _CV_PRINT = false;
let _CV_SHOW_UNIMPORTANT = false;
let _CV_SHOW_ALL_SECTIONS = false;
let _CV_LINK_PAPERS = false;

class CVBuilder {
  
  constructor(contentid,jsonpath,profileid="",section_order=[])
  {
    let self = this;
    self.contentid = contentid;
    self.profileid = profileid;
    self.order = section_order;

    fetch(jsonpath)
      .then((response) => {
        return response.json();
      })
      .then((json) => {

        self.data = json;
        self.buildCV();
      });
  }

  toggleLanguage(NEW_LANG) 
  {
    if (arguments.length) 
      _CV_LANG = NEW_LANG;
    else
      _CV_LANG = _CV_LANG == 0 ? 1 : 0;
    this.buildCV();
  }

  toggleFullView(NEW_IMP)
  {
    if (arguments.length) 
      _CV_SHOW_UNIMPORTANT = NEW_IMP;
    else
      _CV_SHOW_UNIMPORTANT = !_CV_SHOW_UNIMPORTANT;
    this.buildCV();
  }

  toggleAllSections(NEW_ALL_SEC)
  {
    if (arguments.length) 
      _CV_SHOW_ALL_SECTIONS = NEW_ALL_SEC;
    else
      _CV_SHOW_ALL_SECTIONS = !_CV_SHOW_ALL_SECTIONS;
    this.buildCV();
  }

  buildCV() 
  {

    let self = this;
    let data = this.data;

    let order;
    if (self.order.length > 0)
      order = self.order;
    else
      order = data.fieldorder;
    let titles = data.fieldnames;
    let content = data.fieldcontent;
    let important = data.fieldimportance;

    let cvhtml = '';

    order.forEach(function(section) {
      if (!_CV_SHOW_ALL_SECTIONS && !important[section])
        return;

      let title = _T(titles[section]);
      let cvsection = '';

      if (section == "education")
      {
        cvsection = parseTabledSection(title, content[section], parseEducationTableRow, section);
      }
      else if (section == 'additional_working')
      {
        //cvsection = parseImportantSection(title, content[section], parseImportantEntry);
        cvsection = parseTabledSection(title, content[section], parseEducationTableRow, section);
      }
      else if (section == 'academic')
      {
        cvsection = parseImportantSection(title, content[section], parseImportantEntry, section);
      }
      else if (section == 'science')
      {
        let make_section_important = true;
        cvsection = parseTabledSection(title, content[section], parseScientificEntry, section, make_section_important);
      }
      else if (section == 'teaching')
      {
        cvsection = parseTabledSection(title, content[section], parseEducationTableRow, section);
      }
      else if (section == 'voluntary_freetime')
      {
        cvsection = _cv_templates.importantSection.replace("{{ title }}", title)
                                                  .replace("{{ id }}", `id="${section}"`);
        let descriptions = '';
        content[section].forEach(function (entry) {
          descriptions += `<p>${_cv_templates.itemDescription.replace("{{ item-description }}", _T(entry.description))}</p>`;
        });
        cvsection = cvsection.replace("{{ entries }}", descriptions);
      }
      else if (section == 'shortprofile')
      {
        cvsection = _cv_templates.importantSection.replace("{{ title }}", title)
                                                  .replace("{{ id }}", `id="${section}"`);
        let descriptions = '';
        content[section].forEach(function (entry) {
          descriptions += `<p>${_cv_templates.itemDescription.replace("{{ item-description }}", _T(entry.description))}</p>`;
        });
        cvsection = cvsection.replace("{{ entries }}", descriptions);
      }
      else if (section == 'languages')
      {
        cvsection = parseTabledSection(title, content[section], parseLanguageEntry, section);
      }
      else if (section == 'fellowships')
      {
        cvsection = parseTabledSection(title, content[section], parseFellowshipEntry, section);
      }
      else if (section == 'it')
      {
        cvsection = parseTabledSection(title, content[section], parseITEntry, section);
      }
      else if (section == 'publications')
      {
        title = _modify_title(title);
        let this_content = content[section].slice().sort((a, b)=> (+b.year) - (+a.year));
        this_content =_group_tabled_entries_by_left_column(this_content, 'year');

        //cvsection = parseListSection(title, content[section], parsePublicationEntry, section);
        cvsection = parseTabledSection(title, this_content, parseTabledPublicationEntry, section);
      }
      else if (section == 'schools')
      {
        title = _modify_title(title);
        //cvsection = parseListSection(title, content[section], parseListSchoolEntry);
        cvsection = parseTabledSection(title, content[section], parseSchoolEntry, section);
      }
      else if (section == 'theses')
      {
        title = _modify_title(title);
        cvsection = parseTabledSection(title, content[section], parseThesisEntry, section);
      }
      else if (section == 'talks')
      {
        title = _modify_title(title);
        //cvsection = parseListSection(title, content[section], parseTalkEntry, section);
        let this_content = content[section].slice().sort((a, b)=> (+b.year) - (+a.year));
        this_content =_group_tabled_entries_by_left_column(this_content, 'year');
        cvsection = parseTabledSection(title, content[section], parseTabledTalkEntry, section);
      }
      else if (section == 'press')
      {
        title = _modify_title(title);
        let this_content =_group_tabled_entries_by_left_column(content[section], ['year', 'month']);
        cvsection = parseTabledSection(title, this_content, parsePressEntry, section);
      }
      else if (section == 'packages')
      {
        title = _modify_title(title);
        cvsection = parseListSection(title, content[section], parsePackageEntry, section);
      }

      cvhtml += cvsection;
    });

    document.getElementById(self.contentid).innerHTML = cvhtml;

    if (self.profileid != "")
    {
      //short profile
      let bulletList = '';
      content.profile.forEach(function(item) {
        bulletList += _cv_templates.profileItem.replace("{{ item }}", _T(item));
      });

      let profileHTML = _cv_templates.profile.replace("{{ title }}", _T(titles.profile))
                                             .replace("{{ items }}", bulletList);

      document.getElementById(self.profileid).innerHTML = profileHTML;
    }

    for (const counter_content_id of ['publications','talks','press','packages'])
    {
      let counter_el = document.getElementById(`${counter_content_id}-counter`);
      if (counter_el)
        counter_el.innerHTML = content[counter_content_id].length;

      let link = document.getElementById(`${counter_content_id}-link`);
      if (link)
      {
        let this_content = content['science'].filter(entry => entry.id == counter_content_id)[0];
        let linkto;
        if (this_content['link_to_section'] == 'local')
          linkto = '#'+counter_content_id
        else
          linkto = this_content['link_to_section'];
        link.innerHTML = `<a href="${linkto}" class="cv-link">${link.innerHTML} ${_T(this_content['additional_link_text'])}</a>`;
      }
    }
    
    // add reviewing section
    if (important.hasOwnProperty('reviews') && (important['reviews'] || _CV_SHOW_ALL_SECTIONS))
    {
      let reviewSpan = document.getElementById("reviews-list");
      let journals = '';

      let already_mentioned = [];
      let entries = []
      content['reviews'].forEach(function(entry,d){
        if (! already_mentioned.includes(entry.journal) )
        {
          already_mentioned.push(entry.journal);
          entries.push(entry);
        }
      });

      let nrev = entries.length;

      let review_content = content['science'].filter(entry => entry.id == 'reviews')[0];

      if (!review_content['show_counter_instead_of_list'])
      {
        entries.forEach(function(entry,d){

            let l = `<a href="${entry.href}" class="cv-link">`;
            let r = `</a>`;
            let prfx = '';
            let sffx = '\n';
            if ((nrev > 1) && (d == nrev-1)) {
                prfx = (['and ','und '])[_CV_LANG];
                sffx = '.';
            }
            else if ( ((_CV_LANG == 0) && (d < nrev-1)) || ((_CV_LANG==1) && (d<nrev-2)) ){
              sffx = ', ';
            }
            let link = prfx + l + _T(entry.title)+ r + sffx;
            journals += link;
        });
        journals += _T(review_content['additional_link_text']);
      }
      else
      {
        journals = `<a href="http://benmaier.org/CV/index.html#science" class="cv-link">${nrev} ${_T(review_content['additional_link_text'])}</a>`;
      }

      reviewSpan.innerHTML = journals;
    }

    // problem: if you link to the page, the anchor doesnt exist. It's only created after loading.
    // Thus we need to scroll there after creation
    if(window.location.hash) {
      let hash;
      if (window.location.hash.includes("?"))
        hash = window.location.hash.split("?")[0]
      else
        hash = window.location.hash
      let el = document.querySelector(hash);
      if (el)
        el.scrollIntoView();
    }

  };
}

function _group_tabled_entries_by_left_column(entries, left_column)
{
  let is_arr = Array.isArray(left_column);
  if (!is_arr){
    left_column = [left_column];
  }
  let last_label = {};
  left_column.forEach(key => last_label[key] = -1);

  let this_content = entries.slice();

  
  function arrayEquals(a, b) {

    if (!Array.isArray(a) && !Array.isArray(b))
      return a === b;

    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
  }

  function _eq(a,b) {
    let is_equal = true;
    left_column.forEach(function(key){
        is_equal = (is_equal && (arrayEquals(a[key],b[key])));
    });
    return is_equal;

  }

  for(let i=0; i<this_content.length; ++i){
    if (_eq(last_label, this_content[i])){
      left_column.forEach(key => this_content[i][key] = "");
    } else {
      last_label = this_content[i];
    }
  }

  return this_content;
}

function _modify_title(title)
{
  if (!_CV_SHOW_UNIMPORTANT)
  { 
    if (_CV_LANG == 0)
      title = "Selected " + title;
    else
      title = "Ausgew&auml;hlte " + title;
  }
  return title;
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
    let right = `${title}&nbsp;&nbsp;&nbsp;${place}, ${desc}`;
    //let right = `${title}<br/>${place}, ${desc}`;
  //console.log(right);
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
}

function parseTabledSection(title, entries, rowparser, id="", make_section_important=false)
{
  let cvsection = _cv_templates.tabledSection.replace("{{ title }}", title); 
  if (id != "")
    id = `id="${id}"`;
  cvsection = cvsection.replace("{{ id }}",id);
  let rows = '';
  entries.forEach(function(entry) {
    if ( (!_CV_SHOW_UNIMPORTANT && entry.important) || _CV_SHOW_UNIMPORTANT)
      rows += rowparser(entry);
  });
  cvsection = cvsection.replace("{{ table-rows }}", rows);

  if (make_section_important){

    function parseElement(raw){
      let el = document.createElement('div');
      el.innerHTML = raw;
      let res = el.querySelector('*');
      res.remove();
      return res;
    }
    let el = parseElement(cvsection);
    el.classList.add('cv-important-section');
    cvsection = el.outerHTML;
  }
  return cvsection;
}

function parseUntitledTableSection(entries, rowparser)
{
  let cvsection = _cv_templates.untitledTableSection;
  let rows = '';
  entries.forEach(function(entry) {
    if ( (!_CV_SHOW_UNIMPORTANT && entry.important) || _CV_SHOW_UNIMPORTANT)
      rows += rowparser(entry);
  });
  cvsection = cvsection.replace("{{ table-rows }}", rows);
  return cvsection;
}

function parseImportantSection(title, entries, rowparser, id="")
{
  let cvsection = _cv_templates.importantSection.replace("{{ title }}", title); 
  if (id != "")
    id = `id="${id}"`;
  cvsection = cvsection.replace("{{ id }}",id);
  let rows = '';
  entries.forEach(function(entry,i) {
  if ( (!_CV_SHOW_UNIMPORTANT && entry.important) || _CV_SHOW_UNIMPORTANT)
  {
    if (i>0) {
      //rows += '<div style="font-size:16pt;">&nbsp;</div>';
    }
    rows += rowparser(entry);
  }
  });
  cvsection = cvsection.replace("{{ entries }}", rows);
  return cvsection;
}

function parseListSection(title, entries, rowparser, id="")
{
  let cvsection = _cv_templates.listSection.replace("{{ title }}", title); 
  if (id != "")
    id = `id="${id}"`;
  cvsection = cvsection.replace("{{ id }}",id);
  let rows = '';
  entries.forEach(function(entry) {
  if ( (!_CV_SHOW_UNIMPORTANT && entry.important) || _CV_SHOW_UNIMPORTANT)
    rows += rowparser(entry);
  });
  cvsection = cvsection.replace("{{ entries }}", rows);
  return cvsection;
}

function parseImportantEntry(entry) {
    let row = _CV_PRINT ? _cv_templates.importantEntry : _cv_templates.importantEntryNonPrint;
    let time = _cv_templates.timeRange.replace("{{ time-range }}",_T(entry.date));
    let title = _cv_templates.itemTitle.replace("{{ item-title }}",_T(entry.name));
    let place = _cv_templates.itemPlace.replace("{{ item-place }}",_T(entry.place));
    let desc = _cv_templates.itemDescription.replace("{{ item-description }}",_T(entry.description));
    row = row.replace("{{ header-left }}", place)
             .replace("{{ header-right }}", time)
             .replace("{{ item-title }}", title)
             .replace("{{ item-description }}", desc)
          ;

    return row;
}

function parseLanguageEntry(entry) {
  let row = _cv_templates.tableRow;
  let left = _T(entry.name);
  let right = "";

  right = _cv_templates.itemDescription.replace("{{ item-description }}",_T(entry.description));

  row = row.replace("{{ left-col-content }}", left)
           .replace("{{ right-col-content }}", right);

  return row;
}

function parseScientificEntry(entry) {

  let row = _cv_templates.tableRow;
  let left = _T(entry.name);
  let right = "";

  if ( (entry.id == "publications") || (entry.id == "talks") || 
       (entry.id == "press") || (entry.id == 'reviews') ||
       (entry.id == "packages") || (entry.id == 'grants')
     )
  {
    right = _cv_templates.itemDescription.replace("{{ item-description }}",_T(entry.description));
  }
  else if (entry.name.includes("PhD Thesis"))
  {
      let t = entry.description;

      let title = _T(t.title);
      let arxivlink = "https://arxiv.org/abs/" + t.arxiv;      
      let doilink = "https://doi.org/" + t.doi;
      let arxiv = "arXiv:" + _cv_templates.paperLink.replace("{{ linktext }}", t.arxiv)
                                                    .replace("{{ href }}", arxivlink);
      let doi = "doi:" + _cv_templates.paperLink.replace("{{ linktext }}", t.doi)
                                                    .replace("{{ href }}", doilink);

      if (_CV_LINK_PAPERS)
      {
        if (t.href != "")
        {
          title = _cv_templates.paperLink.replace("{{ linktext }}", title)
                                         .replace("{{ href }}", t.href);
        }
        else if (t.arxiv != "")
        {

          title = _cv_templates.paperLink.replace("{{ linktext }}", title)
                                         .replace("{{ href }}", arxivlink);
        }
        else if (t.doi != "")
        {
          title = _cv_templates.paperLink.replace("{{ linktext }}", title)
                                         .replace("{{ href }}", doilink);
        }
      }


      let links = "";
      if (t.arxiv != "")
      {
        links += " " + arxiv + ".";
      }

      if (t.doi != "")
      {
        links += " " + doi + ".";
      }

      let thesis = `${title}`;
      if (links != "")
        thesis += `, ${links}`;

    right = thesis;
  }

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

function parseTabledPublicationEntry(entry) {
    let self = this;
    let authors = entry.authors.map(function(a){
        let _a = a;
        //if (a.includes("B. F. Maier") || a.includes("B. Maier"))
        //  _a = `<span class="cv-item-title">${_a}</span>`;
        _a = _a.replaceAll(". ", ".&nbsp;");
        _a = _cv_templates.paperAuthor.replace("{{ author }}", _a);
        return _a;
      
      }).join(", ");
    let title = _cv_templates.paperTitle.replace("{{ title }}", _T(entry.title));
    let additional = _cv_templates.paperAdd.replace("{{ additional }}", _T(entry.additional));
    let journal = _cv_templates.paperAdd.replace("{{ additional }}", _T(entry.journal));

    let arxivlink = "https://arxiv.org/abs/" + entry.arxiv;
    let doilink = "https://doi.org/" + entry.doi;
    let arxiv = "arXiv:" + _cv_templates.paperLink.replace("{{ linktext }}", entry.arxiv)
                                                  .replace("{{ href }}", arxivlink);
    let doi = "doi:" + _cv_templates.paperLink.replace("{{ linktext }}", entry.doi)
                                                  .replace("{{ href }}", doilink);

    if (_CV_LINK_PAPERS) 
    {
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
    }


    let links = "";
    if (entry.arxiv != "" && entry.doi == "")
    {
      links += " " + arxiv + ".";
    }

    if (entry.doi != "")
    {
      links += " " + doi + ".";
    }

    let paper = _cv_templates.paperTabledEntry.replace("{{ authors }}", authors)
                                        .replace("{{ title }}", title)
                                        .replace("{{ journal }}", journal) 
                                        .replace("{{ links }}", links) 
        ;


    let row = _cv_templates.tableRow;
    let left = _cv_templates.timeRange.replace("{{ time-range }}",_T(entry.year));
    let right = _cv_templates.itemDescription.replace("{{ item-description }}",paper);
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
}

function parsePublicationEntry(entry) {

  let self = this;
  let authors = entry.authors.map(function(a){
      let _a = a;
      //if (a.includes("B. F. Maier") || a.includes("B. Maier"))
      //  _a = `<span class="cv-item-title">${_a}</span>`;
      _a = _a.replaceAll(". ", ".&nbsp;");
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

  if (_CV_LINK_PAPERS) 
  {
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
  }


  let links = "";
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
    let right = `${title}&nbsp;&nbsp;&nbsp;${place}`;
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
}

function parsePressEntry(entry) {

    let title = _T(entry.title);

    if (entry.href != "")
      title = `<a href="${entry.href}" class="cv-link">${title}</a>`;

    let row = _cv_templates.tableRow;
    let left = _cv_templates.timeRange.replace("{{ time-range }}",_T(entry.month) + ' ' +_T(entry.year));
    title = _cv_templates.itemTitle.replace("{{ item-title }}",title);
    let place = _cv_templates.itemPlace.replace("{{ item-place }}",_T(entry.publication));
    let desc = _cv_templates.itemDescription.replace("{{ item-description }}",_T(entry.type));
    let right;
    if (entry.type == "")
      right = `${title}<br/>${place}`;
    else
      right = `${title}<br/>${place}, ${desc}`;
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

function parseTabledTalkEntry(entry) {
  let title = _cv_templates.itemTitle.replace("{{ item-title }}", _T(entry.title));
  let place = _cv_templates.itemPlace.replace("{{ item-place }}", _T(entry.place));
  let event = _cv_templates.itemDescription.replace("{{ item-description }}", _T(entry.event));


  let talk = _cv_templates.talkTableEntry.replace("{{ title }}", title)
                                         .replace("{{ place }}", place )
                                         .replace("{{ event }}", event )
      ;
    let row = _cv_templates.tableRow;
    let left = _cv_templates.timeRange.replace("{{ time-range }}",_T(entry.year));
    let right = _cv_templates.itemDescription.replace("{{ item-description }}",talk);
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", right);

    return row;
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

function parseThesisEntry(entry){

    let row = _cv_templates.tableRow;
    let left = _cv_templates.timeRange.replace("{{ time-range }}",_T(entry.year));

    let t = entry;

      let title = _T(t.title);
      let arxivlink = "https://arxiv.org/abs/" + t.arxiv;      
      let doilink = "https://doi.org/" + t.doi;
      let arxiv = "arXiv:" + _cv_templates.paperLink.replace("{{ linktext }}", t.arxiv)
                                                    .replace("{{ href }}", arxivlink);
      let doi = "doi:" + _cv_templates.paperLink.replace("{{ linktext }}", t.doi)
                                                    .replace("{{ href }}", doilink);

      if (_CV_LINK_PAPERS)
      {
        if (t.href != "")
        {
          title = _cv_templates.paperLink.replace("{{ linktext }}", title)
                                         .replace("{{ href }}", t.href);
        }
        else if (t.arxiv != "")
        {

          title = _cv_templates.paperLink.replace("{{ linktext }}", title)
                                         .replace("{{ href }}", arxivlink);
        }
        else if (t.doi != "")
        {
          title = _cv_templates.paperLink.replace("{{ linktext }}", title)
                                         .replace("{{ href }}", doilink);
        }
      }


      let links = "";
      if (t.arxiv != "")
      {
        links += " " + arxiv + ".";
      }

      if (t.doi != "")
      {
        links += " " + doi + ".";
      }

      let thesis = `${title} (${_T(t.qualification)})`;
      if (links != "")
        thesis += `, ${links}`;



    
    row = row.replace("{{ left-col-content }}", left)
             .replace("{{ right-col-content }}", thesis);

    return row;
  }
 
