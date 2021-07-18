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
      title: '材料统计'
    }
  },
  {
    path: '/plan',
    component: () => import('../views/Plan.vue'),
    meta: {
      key: 2,
      title: '养成规划'
    }
  },
  {
    path: '/item',
    component: () => import('../views/Item.vue'),
    meta: {
      key: 3,
      title: '材料仓库'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
