export default {
  /**
   * build the request url
   * @param {*} path "/helpbot/v1/xxx"
   * @returns full url with https
   */
  getRequestUrl(path) {
    let retStr = `https://localhost:4443`;
    if (path) {
      if (path[0] === '/') {
        retStr = `${retStr}${path}`;
      } else {
        retStr = `${retStr}/${path}`;
      }
    }
    return retStr;
  },
  /**
   * ajax call
   * @param {String} method 'GET' | 'POST'
   * @param {String} path start with /helpbot/v1
   * @param {String | Object} body for GET request, will build as url parameter, else will build as request body
   * @param {Object} opt options, {timeout, handleError},
   *                     if handleError===true, will call this.systemErrorHandler to handle error.
   *                     the this.systemErrorHandler is registered by registerSystemErrorHandler function
   * @returns $.Deferred Object
   */
  request(method, path, body, opt = {
    dataType: 'json'
  }) {
    const headers = {};
    const req = {
      headers,
      method,
      url: this.getRequestUrl(path),
      contentType: 'application/json',
      dataType: opt.dataType,
      xhrFields: {
        withCredentials: true
      }
    };
    if (opt.dataType === '') {
      delete req.dataType;
    }
    if (body) {
      if (method && method.toUpperCase() === 'GET') {
        req.cache = false;
        if (typeof body === 'string') {
          if (body[0] === '?') {
            req.url = `${req.url}${body}`;
          } else {
            req.url = `${req.url}?${body}`;
          }
        } else if (typeof body === 'object') {
          req.url += '?';
          for (const k of Object.keys(body)) {
            req.url += `${k}=${encodeURIComponent(body[k])}&`;
          }
        }
      } else {
        req.data = JSON.stringify(body);
      }
    }
    const ajax = $.ajax(req);
    ajax.fail((e) => {
    console.error('Utils request error:', e);
    });
    return ajax;
  },

  buildRequestBody(queryInput = '', type = 'start') {
    const data = {
        queryInput,
        type
    };
    return data;
  },

  buildBubbleData(text, source='user') {
    return {
      source,
      creationDate: `${Date.now()}`,
      elements: [{
        payload: {
            text: text
        },
        type: 'text'
      }]
    };
  },

  buildSourceToolTip(source) {
    return `<div class="hoverTiptool"> ${source} </div>`;
  },

  escapeHtml(str) {
    const reg = /[&<>"'`=\/](?!(amp;)|(lt;)|(gt;)|(quot;)|(#39t;)|(#x2F;)|(#x60;)|(#x3D;))/g;
    return str === undefined || str === null ?
      '' :
      String(str).replace(reg, (s) => this.entityMap[s]);
  },
};
