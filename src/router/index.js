import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/stat',
    component: () => import('../views/Stat.vue')
  },
  {
    path: '/ops',
    component: () => import('../views/Ops.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
