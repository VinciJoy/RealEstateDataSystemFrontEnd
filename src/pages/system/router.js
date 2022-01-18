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
      path: '/land_resource',
      name: 'landResource',
      component: () => import(/* webpackChunkName: "utils" */ '@system/views/resourceBase/landResource.vue')
    },
    {
      path: '/user_center',
      name: 'userCenter',
      component: () => import(/* webpackChunkName: "utils" */ '@system/views/userCenter/userCenter.vue'),
      children: [
        {
          path: 'user_info',
          name: 'userInfo',
          component: () => import(/* webpackChunkName: "utils" */ '@system/views/userCenter/userInfo/userInfo.vue')
        },
        {
          path: 'land_resource',
          name: 'userCenterLandResource',
          component: () => import(/* webpackChunkName: "utils" */ '@system/views/userCenter/landResource/landResource.vue')
        },
        {
          path: 'user_list',
          name: 'userManage',
          component: () => import(/* webpackChunkName: "utils" */ '@system/views/userCenter/users/users.vue')
        },
        {
          path: 'publish_land_resource/:id',
          name: 'editLandResource',
          component: () => import(/* webpackChunkName: "utils" */ '@system/views/userCenter/landResource/publishLandResource.vue')
        },
        {
          path: 'publish_land_resource',
          name: 'publishLandResource',
          component: () => import(/* webpackChunkName: "utils" */ '@system/views/userCenter/landResource/publishLandResource.vue')
        }
      ]
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: () => import(/* webpackChunkName: "utils" */ '@system/views/utils/confirmation.vue')
    }
  ]
})
