import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/industry_resources/'

export default {
  publishIndustryResource (data) {
    return ajax(rootApi, 'post', {data})
  },
  getIndustryResource (id) {
    return ajax(rootApi + id + '/', 'get')
  },
  getIndustryResources (params) {
    if (!params['pageSize']) {
      params['pageSize'] = 20
    }
    if (!params['pageIndex']) {
      params['pageIndex'] = 1
    }
    if (!params['owner']) {
      params['owner'] = false
    }
    return ajax(rootApi, 'get', {
      params
    })
  },
  deleteIndustryResource (id) {
    return ajax(rootApi + id + '/', 'delete')
  },
  editIndustryResource (id, data) {
    return ajax(rootApi + id + '/', 'put', {data})
  }
}
