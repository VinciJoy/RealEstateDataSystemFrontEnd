import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/land_resources/'

export default {
  publishLandResource (data) {
    return ajax(rootApi, 'post', {data})
  },
  getLandResource (id, params) {
    return ajax(rootApi + id + '/', 'get', {
      params
    })
  },
  likeLandResource (id) {
    return ajax(rootApi + 'like/' + id + '/', 'get')
  },
  getLandResources (params) {
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
  deleteLandResource (id) {
    return ajax(rootApi + id + '/', 'delete')
  },
  editLandResource (id, data) {
    return ajax(rootApi + id + '/', 'put', {data})
  }
}
