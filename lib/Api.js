import trimEnd from 'lodash/trimEnd'
import isString from 'lodash/isString'
import escapeRegExp from 'lodash/escapeRegExp'
import Xhr from './Xhr'
import * as url from 'browser-essentials/url-extended'


const _pathFormatterRegex = new RegExp('{([\\w\|]+?)}', 'g')


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

  filter (opt) {
    this.route.filter(opt)
    return this
  }

  limit (n) {
    this.filter({limit: n})
    return this
  }

  page (n) {
    this.filter({page: n})
    return this
  }

  order (direction) {
    this.filter({order: direction})
    return this
  }

  orderBy (field) {
    this.filter({order_by: field})
    return this
  }

  search (field) {
    this.filter({q: field})
    return this
  }

  clear () {
    this.route = new url.Url(this._route)
    for (let field of this.fields)
      this[field] = null
  }

  _formatRoute () {
    let endpoint = decodeURIComponent(this.route.format())
    let newEndpoint = endpoint
    let match

    while((match = _pathFormatterRegex.exec(endpoint)) !== null) {
      const group = new RegExp(escapeRegExp(match[0]), 'g')
      const keys = match[1].split("|")
      let found = false
      for (let key of keys) {
        if (this[key] !== null && this[key] !== void 0) {
          found = true
          newEndpoint = newEndpoint.replace(group, encodeURIComponent(this[key]))
          break
        }
      }

      if (found === false) {
        newEndpoint = newEndpoint.replace(group, '')
      }
    }

    newEndpoint = url.parse(newEndpoint)
    newEndpoint.pathname = trimEnd(newEndpoint.pathname, '/')
    return newEndpoint.format()
  }

  get endpoint () {
    let route = url.parse(this._formatRoute())
    return route.format()
  }

  get (filler, opt = {}) {
    this.fill(filler)
    return super.get(null, opt)
  }

  head (filler, opt = {}) {
    this.fill(filler)
    return super.head(null, opt)
  }

  options (filler, opt = {}) {
    this.fill(filler)
    return super.options(null, opt)
  }

  post (opt = {}) {
    return super.post(null, opt)
  }

  del (opt = {}) {
    return super.del(null, opt)
  }

  put (opt = {}) {
    return super.put(null, opt)
  }

  patch (opt = {}) {
    return super.patch(null, opt)
  }

  /**
   * @optA is fools gold, it can only be the request Object, not a URL
   */
  ship (optA, optB = {}) {
    const opt = (!isString(optA) && optA !== null && optA !== void 0) ?
      optA : optB;
    return super.ship(this.endpoint, opt)
  }
}


export default Api
