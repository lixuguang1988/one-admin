import ProLayout from '@/layout/ProLayout.vue'
import HomeView from '../views/HomeView.vue'

export default {
  path: '/about',
  name: 'about',
  component: ProLayout,
  children: [
    {
      path: '/about',
      name: 'about-index',
      meta: {
        title: '关于我们',
        icon: 'SettingOutlined',
      },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
}
