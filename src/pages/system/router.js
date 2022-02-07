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
      component: () => import(/* webpackChunkName: "home" */ '@system/views/general/home.vue')
    },
    {
      path: '/tax',
      name: 'tax',
      component: () => import(/* webpackChunkName: "tax" */ '@system/views/utils/tax.vue')
    },
    {
      path: '/land_resource',
      name: 'landResource',
      component: () => import(/* webpackChunkName: "land_resource" */ '@system/views/resourceBase/landResource.vue')
    },
    {
      path: '/land_resource/:id',
      name: 'landResourceDetail',
      component: () => import(/* webpackChunkName: "land_resource" */ '@system/views/resourceBase/landResourceDetail.vue')
    },
    {
      path: '/capital_resource',
      name: 'capitalResource',
      component: () => import(/* webpackChunkName: "capital_resource" */ '@system/views/resourceBase/capitalResource.vue')
    },
    {
      path: '/user_center',
      name: 'userCenter',
      component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/userCenter.vue'),
      children: [
        {
          path: 'user_info',
          name: 'userInfo',
          component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/userInfo/userInfo.vue')
        },
        {
          path: 'land_resource',
          name: 'userCenterLandResource',
          component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/landResource/landResource.vue')
        },
        {
          path: 'capital_resource',
          name: 'userCenterCapitalResource',
          component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/capitalResource/capitalResource.vue')
        },
        {
          path: 'user_list',
          name: 'userManage',
          component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/users/users.vue')
        },
        {
          path: 'publish_land_resource/:id',
          name: 'editLandResource',
          component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/landResource/publishLandResource.vue')
        },
        {
          path: 'publish_land_resource',
          name: 'publishLandResource',
          component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/landResource/publishLandResource.vue')
        },
        {
          path: 'publish_capital_resource/:id',
          name: 'editCapitalResource',
          component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/capitalResource/publishCapitalResource.vue')
        },
        {
          path: 'publish_capital_resource',
          name: 'publishCapitalResource',
          component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/capitalResource/publishCapitalResource.vue')
        }
      ]
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: () => import(/* webpackChunkName: "confirmation" */ '@system/views/utils/confirmation.vue')
    }
  ]
})
