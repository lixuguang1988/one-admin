import ProLayout from '@/layout/ProLayout.vue'

export default {
  path: '/user-department',
  name: 'user-department',
  //  redirect: '/user-department/user',
  component: ProLayout,
  meta: {
    title: '人员管理',
    icon: 'UserOutlined',
  },
  children: [
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    {
      path: '/user-department/user',
      name: 'user',
      meta: {
        title: '员工管理',
      },
      component: () => import('@/views/user-department/user/index.vue'),
    },
    {
      path: '/user-department/department',
      name: 'department',
      meta: {
        title: '部门管理',
      },
      component: () => import('@/views/user-department/department/AboutView.vue'),
    },
    {
      path: '/user-department/department/:departmentId',
      name: 'department-detail',
      meta: {
        activeMenu: '/user-department/department',
        hideMenu: true,
      },
      component: () => import('@/views/user-department/department/AboutView.vue'),
    },
    {
      path: '/user-department/permission',
      name: 'permission',
      meta: {
        title: '权限管理',
      },
      component: () => import('@/views/user-department/permission/index.vue'),
    },
    {
      path: '/user-department/role',
      name: 'role',
      meta: {
        title: '角色管理',
      },
      component: () => import('@/views/user-department/role/index.vue'),
    },
  ],
}
