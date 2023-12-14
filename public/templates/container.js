import botTemplate from './container_temp.js';
import utils from '../util/utils.js';
import QuickReplies from './bot_body/quickreplies.js';
import Bubble from './bot_body/bubble.js';
import BotType from './bot_body/botType.js';

export default class HelpBot {
    constructor() {
        this.isInit = false;
        this.init();
        this.bindEventListener();
        this.contentsToShow = [];
        this.qrObj = null;
    }

    init() {
        const templateHtml = botTemplate({ title: 'Chatbot' });

        $('main').append(templateHtml);
        this.botEl = $('.o-bot');
        this.headerEl = $('.hd');
        this.bodyEl = $('#conversation');
        this.footerEl = $('.ft');
        this.typingInput = $('#ft_input');
        this.sendBtn = $('#ft_send_btn');
        this.botType = new BotType(this.bodyEl);

        this.botEl.hide();
        
    }

    destroy() {
        this.botEl.remove();
    }

    bindEventListener() {
        // on click the close icon
        $('#ocs_hd_close_btn').on('click', (e) => {
            e.preventDefault();
            this.closeBot();
        });

        // on click the entry icon
        $('#ohb_entry_icon').on('click', (e) => {
            e.preventDefault();
            this.openBot('ICON', true);
        });

        // submit text
        this.sendBtn.on('click', (e) => {
            e.preventDefault();
            this.send();
            this.typingInput.focus();
        });

        this.typingInput.on('keydown', (e) => {
            // esc key
            if (e.which === 27) {
                e.preventDefault();
                return this.closeBot();
            }
            // enter key
            if (e.which === 13 && !e.shiftKey) {
                e.preventDefault();
                return this.send();
            }
        }).on('keyup', (e) => {
            if (e.which === 27 || (e.which === 13 && !e.shiftKey)) {
                return;
            }
        }).on('keyup keydown', () => {
            this.adjustInputSize();
        }).on('paste', () => {
            this.adjustInputSize();
        });
    }

    openBot() {
        if (!this.isInit) {
            this.isInit = true;
            this.start();
        }
        this.botEl.show();
    }

    closeBot() {
        this.botEl.hide();
    }

    // call this function only one time
    start() {
        let queryInput = null;
        const body = utils.buildRequestBody(queryInput);
        this.showBotType();
        this.typingInput.attr('disabled', true);
        return utils.request('POST', '/bot/v1/start', body)
            // eslint-disable-next-line no-unused-vars
            .done((result) => {
                this.hideBotType();
                if (result.status === 'FORBIDDEN') {
                    this.showSystemError();
                    return;
                } else if (result.status !== 'OK') {
                    this.showSystemError();
                    return;
                }

                if (result.content && result.content.elements && result.content.elements.length > 0) {
                    this.buildReponseComponent(result.content);
                }
            })
            .fail(() => {
                this.typingInput.attr('disabled', false);
                this.showSystemError();
            });
    }

    // when user click Send button or hit enter key
    send() {
        const input = this.typingInput;
        const text = $.trim(input.val());
        if (text !== '' && text !== input.attr('placeholder')) {
            input.val('');
            input.trigger(new $.Event('keydown'));
            this.sendText(text);
        }
    }

    // send text to bot or agent when user click Send or hit enter
    sendText(text) {
        const content = utils.buildBubbleData(text);
        const ubb = new Bubble(content.elements[0], content.source);
        this.bodyEl.append(ubb.getHtml());
        const body = utils.buildRequestBody(text, 'buttons');
        this.bodyEl.scrollTop(this.bodyEl[0].scrollHeight);
        this.sendToBot(body);
    }

    sendToBot(body) {
        this.hideQuickReplies();
        this.showBotType();
        this.typingInput.attr('disabled', true);
        return utils.request('POST', '/bot/v1/interact', body)
            .done((result) => {
                this.hideBotType();
                if (result.status !== 'OK') {
                    this.showSystemError();
                    return;
                }
                if (result.content && result.content.elements) {
                    this.buildReponseComponent(result.content);
                }
            }).fail(() => {
                this.typingInput.attr('disabled', false);
                this.showSystemError();
            });
    }

    showSystemError() {
        const content = utils.buildBubbleData('System error, please check your network and try again.', 'System');
        const ubb = new Bubble(content.elements[0], content.source);
        this.bodyEl.append(ubb.getHtml());
    }

    // adjust the height of input box when user input text
    adjustInputSize() {
        const input = this.typingInput;
        const text = $.trim(input.val());
        input.css('height', '40px');
    }

    buildReponseComponent(content) {
        const latency = 2000;
        const elements = content.elements;
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].type === 'text') {
                const bbb = new Bubble(elements[i], 'bot');
                this.contentsToShow.push([bbb.getHtml(), latency]);

            } else if (elements[i].type === 'quick_replies') {
                this.qrObj = elements[i];
            }
        }
        this.contentsToShow.push([`<div class="source">Assistant</div>`, 0]);
        this.startContentsTimer();
    }

    showBotType() {
        this.botType.show();
    }
    hideBotType() {
        this.botType.hide();
    }

    startContentsTimer() {
        if (this.contentsTimer) {
            return;
        }
        if (!this.contentsToShow || this.contentsToShow.length <= 0) {
            return;
        }
        this.botType.show();
        this.contentsTimer = setTimeout(this.contentsTimerHandle.bind(this), this.contentsToShow[0][1]);
    }
    contentsTimerHandle() {
        let contentToShow = this.contentsToShow.shift();
        this.botType.hide();

        this.bodyEl.append(contentToShow[0]);
        this.bodyEl.scrollTop(this.bodyEl[0].scrollHeight);

        if (this.contentsToShow[0] && this.contentsToShow[0][1] > 0) {
            this.botType.show();
          }

        if (this.contentsToShow.length > 0) {
            this.contentsTimer = setTimeout(this.contentsTimerHandle.bind(this), this.contentsToShow[0][1]);
        } else {
            this.showQuickReplies();
            this.typingInput.attr('disabled', false);
            this.contentsTimer = null;
        }
    }

    showQuickReplies() {
        if (!this.qrObj) {
            return;
        }
        this.bodyEl.append(QuickReplies.getHtml(this.qrObj));
        this.bodyEl.scrollTop(this.bodyEl[0].scrollHeight);
        $('#qr button').on('click', (e) => {
            e.preventDefault();
            this.hideQuickReplies();
            const btn = $(e.currentTarget);
            this.sendText(btn.attr('data-ori-title'));
          });
        this.qrObj = null;
    }

    hideQuickReplies() {
        $('#qr').remove();
    }
}
