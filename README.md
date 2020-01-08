# CVBuilder

A JavaScript-framework to dynamically build an academic CV from raw data (both print and online, possibly multi-language).

## Install

Just clone this repository and you're good to go. There's no dependencies. Start a server from within the directory and navigate to `index.html` or `print.html`.

## Logic

The CV-builder needs a div with id `cvcontainer` where all sections will be dumped. The print version can also be supplied with a short profile by defining a div with id `profilecontainer`.

Initiate the CV like this

```javascript
let CV = new CVBuilder("cvcontainer","path/to/cv_content.json") // or add an optional 'profilecontainer' as the last argument
```
The following environment variables and methods shape the content of the CV (see #data for those to make sense).

### Language

Choose the first element of the translation arrays to be used

```javascript
let _CV_LANG = 0;
CVBuilder.buildCV();
```

You could also do the following:

```javascript
CVBuilder.toggleLanguage();  //switches between the first and the second language
CVBuilder.toggleLanguage(lang);  //sets language to the new languange `lang` (integer value)
```

### Show/Hide Unimportant Sections

Choose to display _all_ sections.

```javascript
let _CV_SHOW_ALL_SECTIONS = true;
CVBuilder.buildCV();
```

You could also do the following:

```javascript
CVBuilder.toggleAllSections();      // switches between full and condensed view of all sections
CVBuilder.toggleAllSections(show);  // sets view of sections to `show` (boolean)
```

### Show/Hide Unimportant Entries

Choose to display _all_ entries of a section.

```javascript
let _CV_SHOW_UNIMPORTANT = true;
CVBuilder.buildCV();
```

You could also do the following:

```javascript
CVBuilder.toggleFullView();  //switches between the full view and condensed view of entries
CVBuilder.toggleFullView(show);  // sets full view to `show` (boolean)
```

## Print/PDF Version

The print version is a bit more elaborate as it contains a few more columns and `div`s etc.
Also, the CSS-file contains some more definitions that make printing more comfortable.
The only browser that I've found to reliably export correct PDFs is Safari.

## Data

The underlying data is in a huge JSON-file in `data/cv_content.json`. Whenever something can have multiple translations, display them as an array. The arrays should have the same order everywhere otherwise translations will be mixed. The data structure is divided into four sections.

### Field Order

Defines the order of the displayed CV's section. You can leave out sections and they won't be displayed at all.

### Field Names

Contains the sections' names.

### Field Importance

You can label the fields/sections according to important/unimportant. This makes it easier to dynamically switch between showing an exhaustive view or just showing the important sections.

### Field Content

This is the core of the CV. Every field/section consists of a list of objects that have different properties. Each entry of a list should be labeled "important/unimportant". This makes it easier to dynamically switch between showing an exhaustive view of all entries or to just show the important entries.

## TODO

I'd really like to make it possible to obtain environment variables from the URL in order to have even more control over what's shown, directly from entering the URL.
