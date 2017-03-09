import Response from './Response'


class TextResponse extends Response {
  constructor (xhrObj, xhrDispatcher) {
    super(xhrObj, xhrDispatcher)
    this.body = xhrObj.responseText
  }
}


export default TextResponse
