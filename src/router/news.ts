import ProLayout from '@/layout/ProLayout.vue'

export default {
  path: '/news',
  name: 'news',
  //  redirect: '/system/user',
  component: ProLayout,
  meta: {
    title: '资讯管理',
    icon: 'SettingOutlined',
  },
  children: [
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    {
      path: '/news/manage',
      name: 'news-manage',
      meta: {
        title: '新闻管理',
      },
      component: () => import('@/views/news/manage/index.vue'),
    },
    {
      path: '/news/single/:id?',
      name: 'news-single',
      meta: {
        activeMenu: '/news/manage',
        hideMenu: true,
        title: '新闻管理',
      },
      component: () => import('@/views/news/manage/Single.vue'),
    },
    {
      path: '/news/column',
      name: 'column',
      meta: {
        title: '栏目管理',
      },
      component: () => import('@/views/news/column/index.vue'),
    },
    // {
    //   path: '/system/department/:departmentId',
    //   name: 'department-detail',
    //   meta: {
    //     activeMenu: '/system/department',
    //     hideMenu: true,
    //   },
    //   component: () => import('@/views/system/department/AboutView.vue'),
    // },
  ],
}
