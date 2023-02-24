import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
    },
    {
      path: '/tos',
      name: 'terms of service',
      component: () => import('@/views/TOSView.vue'),
    },
    {
      path: '/success',
      name: 'login success',
      component: () => import('@/views/SuccessView.vue'),
    },
    {
      path: '/calendar',
      name: 'Google calendar',
      component: () => import('@/views/CalendarView.vue'),
    },
  ],
})

export default router
