// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '../../../static/css/global.css'

Vue.use(Antd)
Vue.config.productionTip = false

// 注册全局消息提示
Vue.prototype.$message.config({
  duration: 2,
  top: 250
})

Vue.prototype.$error = (s) => Vue.prototype.$message.error(s)
Vue.prototype.$info = (s) => Vue.prototype.$message.info(s)
Vue.prototype.$success = (s) => Vue.prototype.$message.success(s)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
