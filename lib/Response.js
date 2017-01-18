import * as url from 'browser-essentials/url-extended'


class Response {
  constructor (xhrObj, xhrDispatcher) {
      this.status = xhrObj.status
      this.body = xhrObj.response
      this.url = url.parse(xhrObj.responseURL ||
                           xhrObj.getResponseHeader('Location') ||
                           '')
      this.XMLHttpRequest = xhrObj
      this.target = xhrDispatcher
  }
}

export default Response
