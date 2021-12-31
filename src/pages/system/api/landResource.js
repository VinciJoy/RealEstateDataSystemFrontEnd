import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/land_resources/'

export default {
  publishLandResource (data) {
    return ajax(rootApi, 'post', {data})
  },
  getLandResource (id) {
    return ajax(rootApi + id + '/', 'get')
  },
  getLandResources () {
    return ajax(rootApi, 'get')
  },
  editLandResource (id, data) {
    return ajax(rootApi + id + '/', 'put', {data})
  }
}
