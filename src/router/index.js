import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/review',
    name: 'review',
    component: () => import('../views/review/index.vue'),
    meta: {
      title: '复习'
    }
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('../views/manage/index.vue'),
    meta: {
      title: '管理'
    }
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: () => import('../views/statistics/index.vue'),
    meta: {
      title: '统计'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/error/404.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title} - Anki复习助手`
  next()
})

export default router 