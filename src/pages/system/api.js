import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = process.env.API_ROOT
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

export default {
  getUserInfo () {
    return ajax('/user/', 'get')
  }
}

function ajax (url, method, options) {
  if (options !== undefined) {
    var {params = {}, data = {}, headers = {}} = options
  } else {
    params = data = {}
  }
  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      params,
      data,
      headers
    }).then(res => {
      resolve(res)
    }, res => {
      // API请求异常，一般为Server error 或 network error
      Vue.prototype.$error(res.response.data.msg)
      reject(res)
    })
  })
}
