import ProLayout from '@/layout/ProLayout.vue'
import HomeView from '../views/HomeView.vue'

export default {
  path: '/',
  name: 'home',
  component: ProLayout,
  children: [
    {
      path: '/',
      name: 'home-index', // 只有一个菜单的用[name]-index 命名
      meta: {
        title: '首页',
        icon: 'HomeOutlined',
      },
      component: HomeView,
    },
  ],
}
