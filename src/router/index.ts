import { createRouter, createWebHistory } from 'vue-router'
import CalanderView from '@/views/CalanderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CalanderView
    }
  ]
})

export default router
