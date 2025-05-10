import ProLayout from '@/layout/ProLayout.vue'

export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hideMenu: true, // 在菜单中隐藏
    },
  },
  {
    path: '/exception',
    name: 'exception',
    // redirect: '/exception/404',
    component: ProLayout,
    meta: {
      title: '异常',
      hideMenu: true, // 在菜单中隐藏
    },
    children: [
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      {
        path: '/exception/403',
        name: 'unauthorized',
        component: () => import('@/views/exception/Unauthorized.vue'),
        meta: {
          title: '暂无权限',
          hideMenu: true, // 在菜单中隐藏
        },
      },
      {
        path: '/exception/404',
        name: 'notFound',
        component: () => import('@/views/exception/NotFound.vue'),
        meta: {
          title: '404',
          hideMenu: true, // 在菜单中隐藏
        },
      },
    ],
  },
]
