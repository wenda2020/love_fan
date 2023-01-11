function operator(proxies = []) {
  const _ = lodash

  const host = _.get($arguments, 'host')
  const hostPrefix = _.get($arguments, 'hostPrefix')
  const hostSuffix = _.get($arguments, 'hostSuffix')
  const port = _.get($arguments, 'port')
  const portPrefix = _.get($arguments, 'portPrefix')
  const portSuffix = _.get($arguments, 'portSuffix')
  const defaultPath = _.get($arguments, 'defaultPath') || '/'
  let path = _.get($arguments, 'path')
  const pathPrefix = _.get($arguments, 'pathPrefix')
  const pathSuffix = _.get($arguments, 'pathSuffix')
  const defaultMethod = _.get($arguments, 'defaultMethod') || 'GET'
  let method = _.get($arguments, 'method')
  const array = _.get($arguments, 'array')
  const defaultNetwork = _.get($arguments, 'defaultNetwork') || 'http'

  return proxies.map((p = {}) => {
    let network = _.get(p, 'network')
    const type = _.get(p, 'type')
    if (p.name.includes('芜湖') || p.name.includes('杭州') || p.name.includes('济南') || p.name.includes('海南') || p.name.includes('沈阳') || p.name.includes('深圳') || p.name.includes('太原') || p.name.includes('重庆') || p.name.includes('南宁') || p.name.includes('广州') || p.name.includes('九江') || p.name.includes('福州') || p.name.includes('上海') || p.name.includes('扬州') || p.name.includes('贵州') || p.name.includes('昆明') || p.name.includes('长沙') || p.name.includes('武汉') || p.name.includes('郑州') || p.name.includes('陕西') || p.name.includes('北京') || p.name.includes('兰州') || p.name.includes('西宁') || p.name.includes('呼和浩特') || p.name.includes('乌鲁木齐')) {
      _.set(p, 'name', `CN_${p.name}`)
    }
    /* 只修改 vmess 和 vless */
    if (_.includes(['vmess', 'vless'], type)) {
      if (!network) {
        network = defaultNetwork
        _.set(p, 'network', defaultNetwork)
      }
      if (host) {
        if (hostPrefix) {
          _.set(p, 'name', `${hostPrefix}${p.name}`)
        }
        if (hostSuffix) {
          _.set(p, 'name', `${p.name}${hostSuffix}`)
        }
        /* 把 非 server 的部分都设置为 host */
        _.set(p, 'servername', host)
        if (_.get(p, 'tls')) {
          /* skip-cert-verify 在这里设为 true 有需求就再加一个节点操作吧 */
          _.set(p, 'skip-cert-verify', true)
          _.set(p, 'tls-hostname', host)
          _.set(p, 'sni', host)
        }

        if (network === 'ws') {
          _.set(p, 'ws-opts.headers.Host', host)
        } else if (network === 'h2') {
          _.set(p, 'h2-opts.host', array ? [host] : host)
        } else if (network === 'http') {
          _.set(p, 'http-opts.headers.Host', array ? [host] : host)
        } else {
          // 其他? 谁知道是数组还是字符串...先按数组吧
          _.set(p, `${network}-opts.headers.Host`, array ? [host] : host)
        }
      }

      if (network === 'http') {
        if (!_.get(p, 'http-opts.method') && !method) {
          method = defaultMethod
        }
        _.set(p, 'http-opts.method', method)
      }
      if (port) {
        _.set(p, 'port', port)
        if (portPrefix) {
          _.set(p, 'name', `${portPrefix}${p.name}`)
        }
        if (portSuffix) {
          _.set(p, 'name', `${p.name}${portSuffix}`)
        }
      }
      if (network === 'http') {
        let currentPath = _.get(p, 'http-opts.path')
        if (_.isArray(currentPath)) {
          currentPath = _.find(currentPath, i => _.startsWith(i, '/'))
        }
        if (!_.startsWith(currentPath, '/') && !path) {
          path = defaultPath
        }
      }
      if (path) {
        if (pathPrefix) {
          _.set(p, 'name', `${pathPrefix}${p.name}`)
        }
        if (pathSuffix) {
          _.set(p, 'name', `${p.name}${pathSuffix}`)
        }
        if (network === 'ws') {
          _.set(p, 'ws-opts.path', path)
        } else if (network === 'h2') {
          _.set(p, 'h2-opts.path', path)
        } else if (network === 'http') {
          _.set(p, 'http-opts.path', array ? [path] : path)
        } else {
          // 其他? 谁知道是数组还是字符串...先按字符串吧
          _.set(p, `${network}-opts.path`, path)
        }
      }
      if (String(p.port) !== '80'){
        _.set(p, 'name', `[${p.port}]${p.name}`)
      }
      _.set(p, 'name', `[Vm]${p.name}`)
    }
    if ('trojan' === type) {
      if (host) {
        _.set(p, 'skip-cert-verify', true)
        _.set(p, 'sni', host)
        if (hostPrefix) {
          _.set(p, 'name', `${hostPrefix}${p.name}`)
        }
        if (hostSuffix) {
          _.set(p, 'name', `${p.name}${hostSuffix}`)
        }
      }
      if (String(p.port) === '443'){
        _.set(p, 'name', `[${p.port}]${p.name}`)
      }
      _.set(p, 'name', `[Tj]${p.name}`)
    }
    return p
  })
}
