import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      key: 0,
      title: '主页'
    }
  },
  {
    path: '/stat',
    component: () => import('../views/Stat.vue'),
    meta: {
      key: 1,
      title: '统计'
    }
  },
  {
    path: '/ops',
    component: () => import('../views/Ops.vue'),
    meta: {
      key: 2,
      title: '干员'
    }
  },
  {
    path: '/ware',
    component: () => import('../views/Ware.vue'),
    meta: {
      key: 3,
      title: '仓库'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
