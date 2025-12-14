import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/user'
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('../views/User.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: '/question',
        name: 'Question',
        component: () => import('../views/Question.vue'),
        meta: { title: '题目管理' }
      },
      {
        path: '/score',
        name: 'Score',
        component: () => import('../views/Score.vue'),
        meta: { title: '评分查询' }
      }
    ]
  },
  {
    path: '*',
    redirect: '/login'
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 需要认证的路由
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    // 不需要认证的路由
    if (token && to.path === '/login') {
      // 已经登录，尝试访问登录页，重定向到首页
      next('/')
    } else {
      next()
    }
  }
})

export default router
