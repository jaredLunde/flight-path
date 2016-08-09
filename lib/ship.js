import _container from './_container'


export default (method, url, opt) => {
  opt = opt || {}
  opt.method = method
  return _container.ship(url, opt)
}
