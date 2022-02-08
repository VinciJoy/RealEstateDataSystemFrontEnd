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
      path: '/industry_resource',
      name: 'industryResource',
      component: () => import(/* webpackChunkName: "industry_resource" */ '@system/views/resourceBase/industryResource.vue')
    },
    {
      path: '/land_resource/:id',
      name: 'landResourceDetail',
      component: () => import(/* webpackChunkName: "land_resource" */ '@system/views/resourceBase/landResourceDetail.vue')
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
          component: () => import(/* webpackChunkName: "land_resource" */ '@system/views/userCenter/landResource/landResource.vue')
        },
        {
          path: 'publish_land_resource/:id',
          name: 'editLandResource',
          component: () => import(/* webpackChunkName: "land_resource" */ '@system/views/userCenter/landResource/publishLandResource.vue')
        },
        {
          path: 'publish_land_resource',
          name: 'publishLandResource',
          component: () => import(/* webpackChunkName: "land_resource" */ '@system/views/userCenter/landResource/publishLandResource.vue')
        },
        {
          path: 'industry_resource',
          name: 'userCenterIndustryResource',
          component: () => import(/* webpackChunkName: "industry_resource" */ '@system/views/userCenter/industryResource/industryResource.vue')
        },
        {
          path: 'publish_industry_resource/:id',
          name: 'editIndustryResource',
          component: () => import(/* webpackChunkName: "industry_resource" */ '@system/views/userCenter/industryResource/publishIndustryResource.vue')
        },
        {
          path: 'publish_industry_resource',
          name: 'publishIndustryResource',
          component: () => import(/* webpackChunkName: "industry_resource" */ '@system/views/userCenter/industryResource/publishIndustryResource.vue')
        },
        {
          path: 'user_list',
          name: 'userManage',
          component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/users/users.vue')
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
