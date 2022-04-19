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
      path: '/more_analyse',
      name: 'moreAnalyse',
      component: () => import(/* webpackChunkName: "tax" */ '@system/views/moreAnalyse/moreAnalyse.vue')
    },
    {
      path: '/others',
      name: 'others',
      component: () => import(/* webpackChunkName: "tax" */ '@system/views/utils/others.vue')
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
      path: '/industry_resource/:id',
      name: 'industryResourceDetail',
      component: () => import(/* webpackChunkName: "land_resource" */ '@system/views/resourceBase/industryResourceDetail.vue')
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
          path: 'liked_resource',
          name: 'likedResource',
          component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/likedResource/likedResource.vue')
        },
        {
          path: 'subscribe',
          name: 'userCenterSubscribe',
          component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/subscribe/subscribe.vue')
        },
        {
          path: 'subscribe_item_list',
          name: 'userCenterSubscribeItemList',
          component: () => import(/* webpackChunkName: "user_center" */ '@system/views/userCenter/subscribe/subscribeItemList.vue')
        },
        {
          path: 'publish_subscribe/:id',
          name: 'editSubscribe',
          component: () => import(/* webpackChunkName: "land_resource" */ '@system/views/userCenter/subscribe/publishSubscribe.vue')
        },
        {
          path: 'publish_subscribe',
          name: 'publishSubscribe',
          component: () => import(/* webpackChunkName: "land_resource" */ '@system/views/userCenter/subscribe/publishSubscribe.vue')
        },
        {
          path: 'land_resource',
          name: 'userCenterLandResource',
          component: () => import(/* webpackChunkName: "land_resource" */ '@system/views/userCenter/landResource/landResource.vue')
        },
        {
          path: 'super_admin_unhandle',
          name: 'superAdminUnhandle',
          component: () => import(/* webpackChunkName: "admin_management" */ '@system/views/userCenter/adminManagement/superAdminUnhandle.vue')
        },
        {
          path: 'admin_unhandle',
          name: 'adminUnhandle',
          component: () => import(/* webpackChunkName: "admin_management" */ '@system/views/userCenter/adminManagement/adminUnhandle.vue')
        },
        {
          path: 'admin_handle',
          name: 'adminHandle',
          component: () => import(/* webpackChunkName: "admin_management" */ '@system/views/userCenter/adminManagement/adminHandle.vue')
        },
        {
          path: 'super_admin_handle',
          name: 'superAdminHandle',
          component: () => import(/* webpackChunkName: "admin_management" */ '@system/views/userCenter/adminManagement/superAdminHandle.vue')
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
          component: () => import(/* webpackChunkName: "user_list" */ '@system/views/userCenter/users/users.vue')
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
