import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/mobeistudy/'

export default {
  createMobeiStudy (data) {
    return ajax(rootApi, 'post', {data})
  },
  getMobeiStudy () {
    return ajax(rootApi, 'get')
  }
}
