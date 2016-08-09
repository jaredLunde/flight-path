import trimEnd from 'lodash/trimEnd'
import escapeRegExp from 'lodash/escapeRegExp'
import Xhr from './Xhr'
import url from 'browser-essentials/url-extended'


const _pathFormatterRegex = new RegExp('%7B([\\w\|]+?)%7D', 'g')


class Api extends Xhr {
  constructor (route, fields, optXhr) {
    super(optXhr)
    this._route = url.parse(route)
    this.route = url.parse(route)
    this.fields = fields

    this.addFields = fields => {
      for (let field of fields) {
        this[field] = null
      }
    }

    this.addFields(fields)
  }

  fill (data) {
    for (let field in data) {
      if (!this.hasOwnProperty(field))
        throw new Error(`Field '${field}' not found in ` +
                        `'${this.constructor.name}'.`)
      this[field] = data[field]
    }
    return this
  }

  limit (n) {
    this.route.filter({limit: n})
    return this
  }

  page (n) {
    this.route.filter({page: n})
    return this
  }

  order (direction) {
    this.route.filter({order: direction})
    return this
  }

  orderBy (field) {
    this.route.filter({order_by: field})
    return this
  }

  search (field) {
    this.route.filter({q: field})
    return this
  }

  clear () {
    this.route = new url.Url(this._route)
    for (let field of this.fields)
      this[field] = null
  }

  _formatRoute () {
    let endpoint = this.route.format()
    let match

    while (match = _pathFormatterRegex.exec(endpoint)) {
      const group = new RegExp(escapeRegExp(match[0]), 'g')
      const keys = match[1].split("|")
      for (let key of keys) {
        if (this[key] !== null && this[key] !== void 0) {
          endpoint = endpoint.replace(group, encodeURIComponent(this[key]))
          break
        }
      }
    }

    return trimEnd(endpoint, '/')
  }

  get endpoint () {
    let route = url.parse(this._formatRoute())
    return route.format()
  }

  get (filler, opt) {
    this.fill(filler)
    return super.get(null, opt)
  }

  head (filler, opt) {
    this.fill(filler)
    return super.head(null, opt)
  }

  options (filler, opt) {
    this.fill(filler)
    return super.options(null, opt)
  }

  post (payload, opt) {
    opt = opt || {}
    opt.payload = payload
    return super.post(null, opt)
  }

  del (payload, opt) {
    opt = opt || {}
    opt.payload = payload
    return super.del(null, opt)
  }

  put (payload, opt) {
    opt = opt || {}
    opt.payload = payload
    return super.put(null, opt)
  }

  patch (payload, opt) {
    opt = opt || {}
    opt.payload = payload
    return super.patch(null, opt)
  }

  ship (url, opt) {
    return super.ship(this.endpoint, opt)
  }
}


export default Api
