"use strict";

let templates = new Object();

templates.tableRow = `
          <tr class="cv-row">
              <td class="cv-left-col">
                {{ left-col-content }}
              </td>
              <td>
                {{ right-col-content }}
              </td>
          </tr>
`;

templates.timeRange = `<span class="cv-item-time-range">{{ time-range }}</span>`;

templates.itemTitle = `<span class="cv-item-title">{{ item-title }}</span>`;

templates.itemPlace = `<span class="cv-item-place">{{ item-place }}</span>`;

templates.itemDescription = `<span class="cv-item-description">{{ item-description }}</span>`;

templates.untitledTableSection = `
      <div class="cv-section">

            <div class="cv-section-content">

            <table class="cv-table">
              {{ table-rows }}
            </table>
          </div>
      </div>
`;


templates.tabledSection = `
  
      <div class="cv-section">

          <h2 class="cv-section-title">{{ title }}</h2>

            <div class="cv-section-content">

            <table class="cv-table">
              {{ table-rows }}
            </table>
          </div>
      </div>
`;

templates.importantEntry = `
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

templates.importantSection = `
  <div class="cv-section">

      <h2 class="cv-section-title">{{ title }}</h2>

      <div class="cv-section-content">
          {{ entries }}
      </div>
  </div>
`;
