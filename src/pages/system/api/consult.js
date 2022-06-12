import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/consults/'

export default {
  createConsult (data) {
    return ajax(rootApi, 'post', {data})
  },
  editConsult (id, data) {
    return ajax(rootApi + id + '/', 'put', {data})
  },
  deleteConsult (id) {
    return ajax(rootApi + id + '/', 'delete')
  },
  getConsults (params) {
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
  }
}
