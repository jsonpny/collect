import axios from 'axios'
import Vue from 'vue'

// axios 全局配置
Vue.prototype.$http = axios
axios.defaults.timeout = 60000 // 请求超时
// 部署需要根路径
axios.defaults.baseURL = '/finance'

// axios拦截器
axios.interceptors.request.use(
  config => {
    config.headers['authorization'] = sessionStorage.getItem('a')
    if (config.headers['isLoading'] !== false) {
      // 如果配置了headers.isLoading=false，则不显示loading
      showFullScreenLoading()
    }

    return config
  },
  function (error) {
    hideFullScreenLoading()
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  function (response) {
    hideFullScreenLoading()
    if (response.headers.authorization) {
      sessionStorage.setItem('a', response.headers.authorization)
    }
    // 令牌失效，清除本地登录信息，重新登录
    if (response.data.code === 1) {
      Vue.prototype.$message.error(response.data.msg)
      sessionStorage.clear()
      window.location.href = '/'
    }
    if (response.data.code === -1) {
      Vue.prototype.$message.error('操作失败')
    }
    if (response.data.code === -2) {
      Vue.prototype.$message.error(response.data.msg)
    }
    return response
  },
  function (error) {
    hideFullScreenLoading()
    if (error.response.status === 404) {
      Vue.prototype.$message.error('404 请求的地址没有找到')
    } else if (error.response.status === 500) {
      Vue.prototype.$message.error('500 网络异常')
    }
    return Promise.reject(error)
  }
)

// loading框设置局部刷新，且所有请求完成后关闭loading框
let loading
let needLoadingRequestCount = 0 // 声明一个对象用于存储请求个数

function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}
function hideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

function startLoading () {
  loading = Vue.prototype.$loading({
    lock: true,
    text: '努力加载中...',
    // background: 'rgba(0,0,0,0.5)',
    target: document.querySelector('.loading-area') // 设置加载动画区域
  })
}
function endLoading () {
  loading.close()
}

const fetch = (url, params) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        // 替换 all 字段 为全部
        resolve(res.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export { fetch, axios }
