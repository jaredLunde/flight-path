import {setOpt} from 'opt-setter'


class Request {
  constructor (opt) {
    setOpt(this, opt, ['payload',
                       'headers',
                       'responseType',
                       'timeout',
                       'withCredentials',
                       'withCsrf'])
  }
}


export default Request
