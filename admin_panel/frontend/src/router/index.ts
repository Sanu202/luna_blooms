import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/Adminlogin.vue'
import dashboard from '../views/admin_dashboard.vue'
import { clearAuth, isSessionExpired, recordSessionLogout } from '../utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
    },
    {
      path: '/dashboard',
      name: 'admin-dashboard',
      meta: {
        requiresAuth: true,
      },
      component: dashboard,
    }
  ]
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) {
    return true
  }

  const token = localStorage.getItem('token')

  if (!token) {
    clearAuth()
    return { name: 'login' }
  }

  if (isSessionExpired()) {
    try {
      await recordSessionLogout()
    } catch (error) {
      console.error(error)
    }

    clearAuth()
    return { name: 'login' }
  }

  return true
})

export default router
