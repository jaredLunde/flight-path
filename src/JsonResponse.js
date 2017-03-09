import Response from './Response'


class JsonResponse extends Response {
  constructor (xhrObj, xhrDispatcher) {
    super(xhrObj, xhrDispatcher)
    this.body = JSON.parse(xhrObj.responseText)
  }
}


export default JsonResponse
