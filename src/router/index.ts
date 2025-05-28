import { createRouter, createWebHistory } from 'vue-router'
import homeRoute from './home'
import newsRoute from './news'
import productRoute from './product'
import systemRoute from './system'
import aboutRoute from './about'
import otherRoute from './other'
import { getToken } from '@/utils/auth'
import useUserStore from '@/stores/useUserStore'

// 路由配置
export const routes = [homeRoute, newsRoute, productRoute, systemRoute, aboutRoute, ...otherRoute]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

const whiteList = ['/login', '/exception/404', '/exception/403']

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  console.log('beforeEach', to, from)
  const isLoggedIn = getToken()
  if (!isLoggedIn) {
    return next({ path: '/login' })
  }
  try {
    // 请求用户权限
    await userStore.queryPermission()

    // 404
    if (to.matched.length === 0) {
      console.log('当前路径是 404:', to.path)
      return next('/exception/404') // 重定向到 404 页面
    }

    // 白名单
    if (whiteList.includes(to.path)) {
      return next()
    }

    // 检查路由元信息中的权限要求
    const hasPermission = await userStore.checkPermission(to)
    if (!hasPermission) {
      return next({ path: '/exception/403' })
    }
    next()
  } catch (error) {
    console.error('权限检查失败:', error)
    next({ path: '/exception/403' })
  }
})

export default router
