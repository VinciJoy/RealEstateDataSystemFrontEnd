import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/audits/'

export default {
  getAudit (params) {
    return ajax(rootApi, 'get', {
      params
    })
  }
}
