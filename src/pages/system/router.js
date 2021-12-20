import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 解决重复点击菜单报错问题
const originalPush = Router.prototype.push

Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "utils" */ '@system/views/general/home.vue')
    },
    {
      path: '/tax',
      name: 'tax',
      component: () => import(/* webpackChunkName: "utils" */ '@system/views/utils/tax.vue')
    },
    {
      path: '/publish_land_resource',
      name: 'publishLandResource',
      component: () => import(/* webpackChunkName: "utils" */ '@system/views/resourceBase/publishLandResource.vue')
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: () => import(/* webpackChunkName: "utils" */ '@system/views/utils/confirmation.vue')
    }
  ]
})
