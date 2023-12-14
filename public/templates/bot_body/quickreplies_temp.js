import utils from '../../util/utils.js';

export default (input) => {
  let html = `<div class="qr hoverSource" id="qr">`;
  for (const quickReplie of input.quickRepliesList) {
    html = `${html}
      <button data-idx="${quickReplie.index}"
        data-ori-title="${utils.escapeHtml(quickReplie.title)}">
        ${quickReplie.title}
      </button>
      `;
  }
  html = `${html}
  </div>`;
  return html;
};

/*
<div class="ohb-qr" id="ohb-qr">
  {{#each quickReplies}}
    <button data-idx="{{this.index}}">{{this.title}}</button>
  {{/each}}
</div>
*/
