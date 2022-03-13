import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/subscribes/'

export default {
  getSubscribes (params) {
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
  getSubscribeItems (params) {
    if (!params['pageSize']) {
      params['pageSize'] = 20
    }
    if (!params['pageIndex']) {
      params['pageIndex'] = 1
    }
    if (!params['owner']) {
      params['owner'] = false
    }
    return ajax(rootApi + 'items/', 'get', {
      params
    })
  },
  createSubscribe (data) {
    return ajax(rootApi, 'post', {data})
  },
  deleteSubscribe (id) {
    return ajax(rootApi + id + '/', 'delete')
  },
  getSubscribe (id) {
    return ajax(rootApi + id + '/', 'get')
  }
}
