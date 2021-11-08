import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/admin/',
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import(/* webpackChunkName: "utils" */ '@admin/views/utils/tax.vue')
    },
    {
      path: '/tax',
      name: 'tax',
      component: () => import(/* webpackChunkName: "utils" */ '@admin/views/utils/tax.vue')
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: () => import(/* webpackChunkName: "utils" */ '@admin/views/utils/confirmation.vue')
    }
  ]
})
