import url from 'browser-essentials/url-extended'


class Response {
  constructor (xhrObj, xhrDispatcher) {
      this.status = xhrObj.status
      this.body = xhrObj.response
      this.url = url.parse(xhrObj.responseURL)
      this.XMLHttpRequest = xhrObj
      this.target = xhrDispatcher
  }
}

export default Response
