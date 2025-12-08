import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ChatRoom from '../views/ChatRoom.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/chat/:roomId', name: 'chat', component: ChatRoom }
  ]
})

export default router
