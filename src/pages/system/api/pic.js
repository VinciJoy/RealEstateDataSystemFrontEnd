import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/pics/'

export default {
  getTempPic (uid) {
    return ajax(rootApi + 'temp/' + uid + '/', 'get')
  },
  getPic (uid) {
    return ajax(rootApi + uid + '/', 'get')
  },
  uploadPic (file) {
    let formData = new FormData()
    formData.append('file', file)
    return ajax(rootApi, 'post', {data: formData})
  }
}
