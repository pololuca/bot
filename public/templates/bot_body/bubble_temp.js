export default (input) => {
  let html = '';
  const source = input.source;
  const text = input.text.replaceAll('\n', '<br>');
  html = `
  <div class="${source === 'user' ? 'uBubble' : 'bBubble'}">
    <div class="hoverSource">
      ${text}
    </div>
  </div>`;
  return html;
};

