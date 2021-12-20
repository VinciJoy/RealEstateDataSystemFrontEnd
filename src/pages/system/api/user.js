import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/users/'

export default {
  getUserInfo () {
    return ajax(rootApi, 'get')
  },
  login (data) {
    return ajax(rootApi + 'login/', 'post', {data})
  },
  logout (data) {
    return ajax(rootApi + 'logout/', 'post', {data})
  },
  register (data) {
    return ajax(rootApi + 'register/', 'post', {data})
  },
  getCaptcha () {
    return ajax('/captchas/', 'post')
  },
  checkEmail (data) {
    return ajax(rootApi + 'check_email_exists/', 'post', {data})
  },
  checkMobile (data) {
    return ajax(rootApi + 'check_mobile_exists/', 'post', {data})
  }
}
