import ProLayout from '@/layout/ProLayout.vue'

export default {
  path: '/system',
  name: 'system',
  //  redirect: '/system/user',
  component: ProLayout,
  meta: {
    title: '系统管理',
    icon: 'SettingOutlined',
  },
  children: [
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    {
      path: '/system/user',
      name: 'user',
      meta: {
        title: '员工管理',
      },
      component: () => import('@/views/system/user/index.vue'),
    },
    {
      path: '/system/department',
      name: 'department',
      meta: {
        title: '部门管理',
      },
      component: () => import('@/views/system/department/AboutView.vue'),
    },
    {
      path: '/system/department/:departmentId',
      name: 'department-detail',
      meta: {
        activeMenu: '/system/department',
        hideMenu: true,
      },
      component: () => import('@/views/system/department/AboutView.vue'),
    },
    {
      path: '/system/permission',
      name: 'permission',
      meta: {
        title: '权限管理',
      },
      component: () => import('@/views/system/permission/index.vue'),
    },
    {
      path: '/system/role',
      name: 'role',
      meta: {
        title: '角色管理',
      },
      component: () => import('@/views/system/role/index.vue'),
    },
  ],
}
