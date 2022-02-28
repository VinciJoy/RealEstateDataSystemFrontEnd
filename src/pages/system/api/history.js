import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/resource_history/'

export default {
  getHistories (params) {
    return ajax(rootApi, 'get', {
      params
    })
  },
  getHistory (id, params) {
    return ajax(rootApi + id + '/', 'get', {
      params
    })
  }
}
