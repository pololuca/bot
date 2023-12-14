import botBubbleTemplate from './bubble_temp.js';

export default class BotBubble {
  constructor(bubbleObj, source) {
    this.bubbleObj = bubbleObj;
    this.source = source;
  }

  getHtml() {
    return botBubbleTemplate({
        text: this.bubbleObj.payload.text,
        source: this.source,
      });
  }

}
