import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    redirect: '/today-review'
  },
  {
    path: '/today-review',
    name: 'today-review',
    component: () => import('@/views/today-review/index.vue'),
    meta: {
      title: '今日复习'
    }
  },
  {
    path: '/card',
    children: [
      {
        path: 'create',
        name: 'card-create',
        component: () => import('@/views/card/create.vue'),
        meta: {
          title: '新增卡片',
          parent: '/card/list'
        }
      },
      {
        path: 'list',
        name: 'card-list',
        component: () => import('@/views/card/list.vue'),
        meta: {
          title: '卡片库'
        }
      }
    ]
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settings/index.vue'),
    meta: {
      title: '设置'
    }
  },
  {
    path: '/settings/interval',
    name: 'settings-interval',
    component: () => import('@/views/settings/interval.vue'),
    meta: {
      title: '复习间隔规则'
    }
  },
  {
    path: '/login/wechat',
    name: 'login-wechat',
    component: () => import('@/views/login/wechat.vue'),
    meta: { title: '微信登录' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/error/404.vue'),
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
  document.title = to.meta.title ? `${to.meta.title} - Anki复习助手` : 'Anki复习助手'
  
  const userStore = useUserStore()
  const token = userStore.token
  
  // 白名单路由（不需要登录就能访问的路由）
  const whiteList = ['/login/wechat']
  
  if (whiteList.includes(to.path)) {
    // 如果已登录且访问登录页，重定向到首页
    if (token) {
      next('/')
    } else {
      next()
    }
  } else {
    // 非白名单路由，检查是否登录
    if (!token) {
      // 未登录，重定向到微信登录页
      next('/login/wechat')
    } else {
      // 已登录，允许访问
      next()
    }
  }
})

export default router 