import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/users/'

export default {
  submitCertificateForm (data) {
    return ajax(rootApi + 'certificate/', 'post', {data})
  },
  editCertificateForm (data) {
    return ajax(rootApi + 'certificate/', 'patch', {data})
  },
  getUserInfo () {
    return ajax(rootApi, 'get')
  },
  getUsers (pageSize = 20, pageIndex = 1, keywords) {
    let params = {
      pageSize: pageSize,
      pageIndex: pageIndex
    }
    if (keywords) {
      params['keywords'] = keywords
    }
    return ajax(rootApi + 'list/', 'get', {
      params
    })
  },
  deleteUser (userID) {
    return ajax(rootApi + userID + '/', 'delete')
  },
  editUser (userID, data) {
    return ajax(rootApi + userID + '/', 'patch', {data})
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
