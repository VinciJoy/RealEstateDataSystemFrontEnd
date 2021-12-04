import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import(/* webpackChunkName: "utils" */ '@system/views/general/home.vue')
    },
    {
      path: '/tax',
      name: 'tax',
      component: () => import(/* webpackChunkName: "utils" */ '@system/views/utils/tax.vue')
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: () => import(/* webpackChunkName: "utils" */ '@system/views/utils/confirmation.vue')
    }
  ]
})
