import Vue from 'vue'
import VueRouter from 'vue-router'
import UserView from '../views/UserView.vue'
import QuestionView from '../views/QuestionView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/user',
    name: 'user',
    component: UserView
  },
  {
    path: '/question',
    name: 'question',
    component: QuestionView
  },
  {
    path: '/',
    redirect: '/user'
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router

