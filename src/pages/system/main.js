// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '../../../static/css/global.css'
import store from '@/store/store'

Vue.use(Antd)
Vue.config.productionTip = false

// 注册全局消息提示
Vue.prototype.$message.config({
  duration: 2,
  top: 250
})

// eslint-disable-next-line no-extend-native
Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === val) return i
  }
  return -1
}

// eslint-disable-next-line no-extend-native
Array.prototype.remove = function (val) {
  let index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}

Vue.prototype.$error = (s) => Vue.prototype.$message.error(s)
Vue.prototype.$info = (s) => Vue.prototype.$message.info(s)
Vue.prototype.$success = (s) => Vue.prototype.$message.success(s)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
