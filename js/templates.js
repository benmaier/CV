"use strict";

let _cv_templates = new Object();

_cv_templates.tableRow = `
          <tr class="cv-row">
              <td class="cv-left-col">
                {{ left-col-content }}
              </td>
              <td>
                {{ right-col-content }}
              </td>
          </tr>
`;

_cv_templates.timeRange = `<span class="cv-item-time-range">{{ time-range }}</span>`;

_cv_templates.itemTitle = `<span class="cv-item-title">{{ item-title }}</span>`;

_cv_templates.itemPlace = `<span class="cv-item-place">{{ item-place }}</span>`;

_cv_templates.itemDescription = `<span class="cv-item-description">{{ item-description }}</span>`;

_cv_templates.untitledTableSection = `
      <div class="cv-section">

            <div class="cv-section-content">

            <table class="cv-table">
              {{ table-rows }}
            </table>
          </div>
      </div>
`;


_cv_templates.tabledSection = `
  
      <div class="cv-section cv-avoid-breaking">

          <div class="cv-section-title" {{ id }}>{{ title }}</div>

            <div class="cv-section-content">

            <table class="cv-table">
              {{ table-rows }}
            </table>
          </div>
      </div>
`;

_cv_templates.importantEntry = `
        <div class="cv-important-entry">

          <div class="cv-important-header">
              <div class="cv-important-header-left">
                  {{ header-left }}
              </div>
              <div class="cv-important-header-right">
                  {{ header-right }}
              </div>
          </div>
          <div class="cv-important-title">
              {{ item-title }}
          </div>
          <div class="cv-description">
              {{ item-description }}
          </div>
        </div>

`;

_cv_templates.importantEntryNonPrint = `
        <div class="cv-important-entry">

          <div class="cv-important-title">
              {{ item-title }}
          </div>
          <div class="cv-description">
                  {{ header-right }}, {{ header-left }} <br/>
              {{ item-description }}
          </div>
        </div>

`;

_cv_templates.importantSection = `
  <div class="cv-section cv-important-section cv-avoid-breaking">

      <div class="cv-section-title" {{ id }}>{{ title }}</div>

      <div class="cv-section-content">
          {{ entries }}
      </div>
  </div>
`;

_cv_templates.profileItem = `<li class="profile">{{ item }}</li>`;

_cv_templates.profile = `
              <b>{{ title }}</b>
              <ul class="bullets-right">
                {{ items }}
              </ul>
`;

_cv_templates.listSection = `
  <div class="cv-section">

      <div class="cv-section-title" {{ id }}>{{ title }}</div>

      <div class="cv-section-content">
        <ul class="cv-list">
          {{ entries }}
        </ul>
      </div>
  </div>
`;

_cv_templates.listSectionItem = `<li class="list-section">{{ item }}</li>`;

_cv_templates.paperAuthor = `<span class="cv-paper-author">{{ author }}</span>`;
_cv_templates.paperTitle = `<span class="cv-paper-title">{{ title }}</span>`;
_cv_templates.paperLink = `<a href="{{ href }}" class="cv-link" target="_blank">{{ linktext }}</a>`;
_cv_templates.paperAdd = `<span class="cv-paper-additional">{{ additional }}</span>`;
_cv_templates.paperEntry = `{{ authors }} ({{ year }}). &ldquo;{{ title }}&rdquo;. {{ additional }}.{{ links }}`;

_cv_templates.talkTitle = `<span class="cv-talk-title">{{ title }}</span>`;
_cv_templates.talkPlace = `<span class="cv-talk-place">{{ place }}</span>`;
_cv_templates.talkEvent = `<span class="cv-talk-event">{{ event }}</span>`;
_cv_templates.talkEntry = `{{ title }}, {{ event }}, {{ place }} ({{ year }})`

_cv_templates.packageTitle = `<span class="cv-item-title">{{ title }}</span>`;
_cv_templates.packageHREF = `<a href="https://{{ href }}" class="cv-link" target="_blank"><span class="cv-package-href">{{ href }}</span></a>`;
_cv_templates.packageDescription = `<span class="cv-item-description">{{ description }}</span>`;
_cv_templates.packageEntry = `{{ title }}, {{ href }}, {{ description }}`

_cv_templates.schoolTitle = `<span class="cv-school-title">{{ title }}</span>`;
_cv_templates.schoolPlace = `<span class="cv-school-place">{{ place }}</span>`;
_cv_templates.schoolEntry = `{{ title }}, {{ place }} ({{ year }})`

