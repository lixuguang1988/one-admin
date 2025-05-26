<template>
  <a-layout class="pro-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      ref="siderRef"
      :trigger="null"
      :collapsed-width="48"
      collapsible
      class="pro-layout-sider"
    >
      <div class="pro-layout-logo">
        <Logo class="logo" />
        <span v-if="!collapsed">{{ title }}</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        :openKeys="openKeys"
        theme="dark"
        mode="inline"
        @click="handleMenuClick"
      >
        <template v-for="item in dataSource" :key="item.key">
          <a-menu-item v-if="!item.children" :key="item.key">
            <component v-if="item.icon && Icons[item.icon]" :is="Icons[item.icon]" />
            <span>{{ item.label }}</span>
          </a-menu-item>
          <sub-menu v-else :subItem="item"> </sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout-header class="pro-layout-header">
      <menu-unfold-outlined
        v-if="collapsed"
        class="pro-layout-trigger"
        @click="() => (collapsed = !collapsed)"
      />
      <menu-fold-outlined
        v-else
        class="pro-layout-trigger"
        @click="() => (collapsed = !collapsed)"
      />
      <header-bar></header-bar>
    </a-layout-header>
    <a-layout-content class="pro-layout-content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { routes } from '@/router/index'
import * as Icons from '@ant-design/icons-vue'
import { transformRoutesToMenuData, findAncestorKeys } from '@/utils/menu'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import Logo from '@/assets/logo.svg'
import useUserStore from '@/stores/useUserStore'
import SubMenu from './components/SubMenu.vue'
import HeaderBar from './components/HeaderBar.vue'
import './prolayout.less'

const title = import.meta.env.VITE_APP_TITLE

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

console.log(routes, 'routes', userStore.menus)
const getActiveKey = () => {
  let pathKey
  if (route.meta.activeMenu) {
    pathKey = route.meta.activeMenu // 如果路由有 activeMenu，则使用它
  } else {
    const matched = route.matched
    if (matched.length > 0) {
      const matchedRoute = matched[matched.length - 1]
      pathKey = matchedRoute.path // 获取路由的第二个部分作为 activeKey
    }
  }
  return menuUrlMap[pathKey] && pathKey
}
const getOpenKeys = () => {
  const pathKey = getActiveKey()
  if (!pathKey) {
    return []
  }
  const parents = findAncestorKeys(dataSource, pathKey)
  return parents
}

const menuUrlMap = {}
const dataSource = transformRoutesToMenuData(routes, menuUrlMap, userStore.menus) // 菜单数据
// const dataSource: MenuData[] = [
//   {
//     type: 'sub',
//     key: 'menu1',
//     icon: 'setting',
//     label: 'Menu 1',
//     children: [{ type: 'item', key: 'menu1-sub', label: 'Item 1 Sub 1', icon: 'setting' }],
//   },
// ]
const selectedKeys = ref([])
const openKeys = ref(getOpenKeys())

console.log(dataSource, menuUrlMap, 'dataSource')

watch(
  () => route.query,
  (newValue) => {
    console.log(route, route.query, 'route.query')
  },
  {
    immediate: true,
  },
)

watch(
  () => route.path,
  (newValue) => {
    const pathKey = getActiveKey()
    console.log(route, route.path, pathKey, 'route.path')
    if (pathKey) {
      selectedKeys.value = [pathKey]
    }
  },
  {
    immediate: true,
  },
)

const handleMenuClick = ({ item, key, keyPath }) => {
  // Handle menu click event
  console.log('Menu item clicked:', item, key, keyPath, menuUrlMap[key])
  router.push(key) // 跳转到对应的路由
}

/************* 侧边栏收起 改变--sider-width **************/
const collapsed = ref(false)
const siderRef = ref(null)
let animationId
const updateSiderWidth = () => {
  if (siderRef.value) {
    const width = siderRef.value.$el.offsetWidth
    document.documentElement.style.setProperty('--sider-width', `${parseInt(width)}px`)
    animationId = window.requestAnimationFrame(updateSiderWidth)
  }
}
onMounted(() => {
  if (siderRef.value) {
    siderRef.value.$el.addEventListener('transitionstart', () => {
      animationId = requestAnimationFrame(updateSiderWidth)
    })
    siderRef.value.$el.addEventListener('transitionend', () => {
      cancelAnimationFrame(animationId)
    })
  }
})
onUnmounted(() => {
  if (siderRef.value) {
    siderRef.value.$el.removeEventListener('transitionstart')
    siderRef.value.$el.removeEventListener('transitionend')
  }
})
</script>
