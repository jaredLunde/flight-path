import _sender from './_sender'


export default (method, url, opt) => {
  opt = opt || {}
  opt.method = method
  return _sender.send(url, opt)
}
