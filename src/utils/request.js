import Vue from 'vue'
import axios from 'axios'
import store from '@/store/store'
import {HTTP} from './constants'

Vue.prototype.$http = axios
axios.defaults.baseURL = process.env.API_ROOT + '/system'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true

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
      if (res.data.code !== 2000) {
        Vue.prototype.$error(res.data.msg)
        reject(res)
      }
      resolve(res)
    }, res => {
      if (res.toString().includes('404')) {
        Vue.prototype.$error('api错误!')
        reject(res)
      } else if (res.response.data.code === HTTP.NOT_LOGIN) {
        store.dispatch('changeModalStatus', {'mode': 'login', 'visible': true})
      } else if (res.toString().includes('Network Error')) {
        Vue.prototype.$error('网络错误!')
        reject(res)
      } else {
        Vue.prototype.$error(res.response.data.msg)
        reject(res)
      }
    })
  })
}

export default ajax
