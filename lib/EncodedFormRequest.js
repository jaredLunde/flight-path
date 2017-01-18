import urlEncodeForm from 'form-urlencoded'
import Request from './Request'


class EncodedFormRequest extends Request {
  constructor (opt) {
    super(opt)
    this.payload = urlEncodeForm(this.payload)
    this.headers = this.headers || {}
    this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
}


export default EncodedFormRequest
