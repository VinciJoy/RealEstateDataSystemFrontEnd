import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/alipay/'

export default {
  becomeMembership (params) {
    return ajax(rootApi, 'get', {
      params
    })
  },
  buyItem (params) {
    return ajax(rootApi + 'buyItem/', 'get', {
      params
    })
  }
}
