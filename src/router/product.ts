import ProLayout from '@/layout/ProLayout.vue'

export default {
  path: '/product',
  name: 'product',
  //  redirect: '/system/user',
  component: ProLayout,
  meta: {
    title: '商品管理',
    icon: 'SettingOutlined',
  },
  children: [
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    {
      path: '/product/pets',
      name: 'pets',
      meta: {
        title: '宠物管理',
      },
      component: () => import('@/views/product/pets/index.vue'),
    },
    {
      path: '/product/dict',
      name: 'dict',
      meta: {
        title: '字典管理',
      },
      component: () => import('@/views/product/dict/index.vue'),
    },
    {
      path: '/product/pet/:id?',
      name: 'pet-single',
      meta: {
        activeMenu: '/product/pets',
        hideMenu: true,
      },
      component: () => import('@/views/product/pets/Single.vue'),
    },
  ],
}
