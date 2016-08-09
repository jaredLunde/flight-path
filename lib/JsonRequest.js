import Request from './Request'


class JsonRequest extends Request {
  constructor (opt) {
    super(opt)
    this.payload = this.payload !== void 0 ?
                   JSON.stringify(this.payload) : this.payload
    this.headers = this.headers || {}
    this.headers['Content-Type'] = 'application/json'
  }
}


export default JsonRequest
