import quickRepliesTemplate from './quickreplies_temp.js';

export default {
  quickRepliesList: null,

  getHtml(quickRepliesObj) {
    console.log(quickRepliesObj);
    this.quickRepliesList = quickRepliesObj.payload.quick_replies.reverse();
    this.quickRepliesList.forEach((btnObj, index) => {
      btnObj.index = index;
    });
    const html = quickRepliesTemplate({ quickRepliesList: this.quickRepliesList, source: this.source });
    return html;
  }
};
