import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$http = axios

const requester = axios.create({
  baseURL: process.env.API_ROOT, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout
  xsrfCookieName:'csrftoken',
  xsrfHeaderName:'X-CSRFToken'
})

requester.interceptors.request.use(
  config => {
    console.log('config', config)
  }, error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  })

requester.interceptors.response.use(
  response=>{
    console.log("response:",response)
    return  response;
  },
  error => {
    console.log('err' + error) // for debug
    Vue.prototype.$error(res.response.data.msg)
    return Promise.reject(error)
  })


export  default  requester
