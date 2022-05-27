import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/videos/'

export default {
  createVideo (data) {
    return ajax(rootApi, 'post', {data})
  },
  getVideos (params) {
    return ajax(rootApi, 'get', {
      params
    })
  },
  editVideo (id, data) {
    return ajax(rootApi + id + '/', 'patch', {data})
  },
  deleteVideo (id) {
    return ajax(rootApi + id + '/', 'delete')
  }
}
