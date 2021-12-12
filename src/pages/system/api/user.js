import requester from '@/utils/request'

// 处理用户请求

/**
 * 获取用户信息
 * @returns {*}
 */
export function getUserInfo () {
  return requester({
    url: '/api/system/users/',
    method: 'get'
  })
}

/**
 * 获取登录的验证码
 * @returns { AxiosPromise }
 */
export function getLoginVerifycode () {
  return requester({
    url: '/api/system/captchas',
    method: 'get'
  })
}

/**
 * 后台登录
 * @param param
 * @returns {*}
 */
export function adminLogin (param) {
  return requester({
    url: '/api/system/users/login',
    method: 'post',
    param
  })
}

/**
 * 后台注册
 * @param param
 * @returns {*}
 */
export function adminUserRegirest (param) {
  return requester({
    url: '/api/system/users/register/',
    method: 'post',
    param
  })
}
