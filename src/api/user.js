import requester from '@/utils/request'

// 处理用户请求

/**
 * 获取用户信息
 * @returns {*}
 */
export function  getUserInfo () {
   return requester({
    url: 'user',
    method: 'get',
  })
}

/**
 * 获取登录的验证码
 * @returns {AxiosPromise}
 */
export function getLoginVerifycode(){
   return  requester({
     url: 'system/login/verifycode',
     method: 'get',
   })
}
