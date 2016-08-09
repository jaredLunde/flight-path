import Emitter from 'emitter-extended'
import setDefinedOpt from 'opt-setter/setDefinedOpt'
import Cookies from 'js-cookie'
import cookie from 'cookie'


class Xhr extends Emitter {
  static READYSTATECHANGE = 'readystatechange'
  static START = 'start'
  static PROGRESS = 'progress'
  static SUCCESS = 'success'
  static TIMEOUT = 'timeout'
  static DONE = 'done'
  static ERROR = 'error'
  static ABORTED = 'aborted'
  static XHR_EVENTS = {readystatechange: Xhr.READYSTATECHANGE,
                       loadstart: Xhr.START,
                       progress: Xhr.PROGRESS,
                       load: Xhr.SUCCESS,
                       timeout: Xhr.TIMEOUT,
                       loadend: Xhr.DONE,
                       error: Xhr.ERROR,
                       abort: Xhr.ABORTED}

  constructor (opt) {
    super()
    this.hostname
    this.basePath
    this.timeout
    this.beforeSend
    this.responseType = 'json'  // Default response type
    this.responseTypes = {TEXT: 'text',
                          BUFFER: 'arraybuffer',
                          BLOB: 'blob',
                          HTML: 'document',
                          XML: 'document',
                          JSON: 'json'}
    this.withCsrf = true
    this.csrfCookieName = 'csrf'
    this.csrfHeaderName = 'x-csrf-token'
    this.csrfSafeMethods = ['get', 'options', 'head']
    this.withCredentials = true
    this.checkSupport = {cors: (XHR) => {
      'withCredentials' in new XMLHttpRequest()}
    }
    this.register(...Object.keys(Xhr.XHR_EVENTS).map(x => Xhr.XHR_EVENTS[x]))
    setDefinedOpt(this, opt)
  }

  get (url, opt) {
    opt = opt === void 0 || opt === null ? {} : opt
    opt.method = 'GET'
    return this.send(url, opt)
  }

  post (url, opt) {
    opt = opt === void 0 || opt === null ? {} : opt
    opt.method = 'POST'
    return this.send(url, opt)
  }

  put (url, opt) {
    opt = opt === void 0 || opt === null ? {} : opt
    opt.method = 'PUT'
    return this.send(url, opt)
  }

  patch (url, opt) {
    opt = opt === void 0 || opt === null ? {} : opt
    opt.method = 'PATCH'
    return this.send(url, opt)
  }

  del (url, opt) {
    opt = opt === void 0 || opt === null ? {} : opt
    opt.method = 'DELETE'
    return this.send(url, opt)
  }

  options (url, opt) {
    opt = opt === void 0 || opt === null ? {} : opt
    opt.method = 'OPTIONS'
    return this.send(url, opt)
  }

  head (url, opt) {
    opt = opt === void 0 || opt === null ? {} : opt
    opt.method = 'HEAD'
    return this.send(url, opt)
  }


  send (url, opt) {
    const xhr = new XMLHttpRequest()
    xhr.open(opt.method || 'GET', String(url))
    this._listen(xhr)
    this._setOptions(xhr, opt)
    this._setCsrfCredentials(opt, xhr)
    const responseType = opt.responseType || this.responseType
    const xhrResponseType = this.responseTypes[
      (responseType === 'json' ? 'text' : responseType).toUpperCase()]
    if (responseType)
      xhr.responseType = xhrResponseType
    if (this.beforeSend)
      this.beforeSend(this, xhr)
    return new Promise((resolve, reject) => {
      xhr.addEventListener('load', e => {
        let response = null
        resolve(this._wrapResponse(responseType, xhr))
      })
      xhr.addEventListener('error', e => {
        reject(new Response(xhr, this))
      })
      xhr.send(opt.payload)
    })
  }

  _wrapResponse (responseType, xhr) {
    let response = null
    switch (responseType) {
      case 'json':
        response = new JsonResponse(xhr, this)
        break
      case 'text':
        response = new TextResponse(xhr, this)
        break
      default:
        response = new Response(xhr, this)
    }
    return response
  }

  _listen (xhr) {
    for (let evt in Xhr.XHR_EVENTS)
      xhr.addEventListener(evt, e => {this.emit(Xhr.XHR_EVENTS[evt], e)})
  }

  _setOptions (xhr, opt) {
    const withCredentials = opt.withCredentials !== void 0 ?
                            opt.withCredentials : this.withCredentials
    if (withCredentials) {
      xhr.withCredentials = true
    }

    const timeout = opt.timeout !== void 0 ? opt.timeout : this.timeout
    if (timeout) {
      xhr.timeout = timeout
    }

    if (opt.headers) {
      for (var name in opt.headers)
        xhr.setRequestHeader(name, opt.headers[name])
    }
  }

  _isCsrfMethod (method) {
    const csrfSafeMethods = []
    for (let safeMethod of this.csrfSafeMethods) {
      if (safeMethod.toUpperCase() === method.toUpperCase())
        return false
    }
    return true;
  }

  _setCsrfCredentials (opt, xhr) {
    const withCsrf = opt.withCsrf !== void 0 ? opt.withCsrf : this.withCsrf;
    if (!withCsrf || !this._isCsrfMethod(opt.method))
      return;
    var csrfCredentials = Cookies.get(this.csrfCookieName)
    if (csrfCredentials)
      xhr.setRequestHeader(this.csrfHeaderName, csrfCredentials)
  }
}


export default Xhr
