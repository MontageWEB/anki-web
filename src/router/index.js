import { createRouter, createWebHistory } from 'vue-router'

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
  next()
})

export default router 