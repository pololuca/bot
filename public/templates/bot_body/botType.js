export default class BotType {
    constructor(bodyEl) {
        this.bodyEl = bodyEl;
        this.timer = null;
        this.dots = 0;
    }

    getHtml() {
        const html = `
        <div class="bot-typing" id="bot_typing">
          <div></div>
        </div>`;
        return html;
    }

    show() {
        this.hide();
        this.bodyEl.append(this.getHtml());
        this.timer = setInterval(() => {
            if (this.dots < 3) {
                $('#bot_typing > div').append("<span class='circle' aria-hidden='true'/>");
                this.dots += 1;
            } else {
                $('#bot_typing > div').html('');
                this.dots = 0;
            }
        }, 600);
    }

    hide() {
        if (this.timer) {
            try {
                clearInterval(this.timer);
            } catch (err) {
                // do nothing
            }
            this.timer = null;
        }
        $('#bot_typing').remove();
        this.dots = 0;
    }
}
