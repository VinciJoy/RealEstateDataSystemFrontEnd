import ajax from '@/utils/request'

// 处理用户请求
let rootApi = '/system_setting/'

export default {
  settingSystem (data) {
    return ajax(rootApi, 'post', {data})
  },
  getSystemSetting () {
    return ajax(rootApi, 'get')
  }
}
