import Vue from 'vue'
import Router from 'vue-router'
import tax from '@/userPages/tax'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: tax
    },
    {
      path: '/tax',
      name: 'tax',
      component: tax
    }
  ]
})
