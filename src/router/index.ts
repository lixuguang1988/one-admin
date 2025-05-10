import { createRouter, createWebHistory } from 'vue-router'
import userDepartmentRoute from './userDepartment'
import homeRoute from './home'
import aboutRoute from './about'
import otherRoute from './other'
import { getToken } from '@/utils/auth'
import useUserStore from '@/stores/useUserStore'

// 路由配置
export const routes = [homeRoute, userDepartmentRoute, aboutRoute, ...otherRoute]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

const whiteList = ['/login', '/exception/404', '/exception/403']

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  console.log('beforeEach', to, from)
  const isLoggedIn = getToken()

  if (to.matched.length === 0) {
    console.log('当前路径是 404:', to.path)
    return next('/exception/404') // 重定向到 404 页面
  }

  if (whiteList.includes(to.path)) {
    return next()
  }

  if (!isLoggedIn) {
    return next({ path: '/login' })
  }

  try {
    // 检查路由元信息中的权限要求
    if (!to.meta.whiteList) {
      const hasPermission = await userStore.checkPermission(to)
      if (!hasPermission) {
        return next({ path: '/exception/403' })
      }
    }
    next()
  } catch (error) {
    console.error('权限检查失败:', error)
    next({ path: '/exception/403' })
  }
})

export default router
