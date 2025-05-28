import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'
import { queryPermissionApi } from '@/api/common/index'

interface UserInfo {
  id: string
  name: string
  username: string
  email: string
  phone: string
  avatar: string
  department: string
  role: string
  [key: string]: any
}

interface Permission {
  menus: string[]
  buttons: string[]
}

interface UserState {
  userInfo: UserInfo
  permission: Permission
  menus: Record<string, any>
  permissionFetched: boolean
  [key: string]: any
}

const useUserStore = defineStore('userInfo', {
  state: (): UserState => {
    return {
      userInfo: {
        id: '',
        name: '',
        username: '',
        email: '',
        phone: '',
        avatar: '',
        department: '',
        role: '',
      },
      permission: {
        menus: [],
        buttons: [],
      },
      menus: {},
      permissionFetched: false,
    }
  },
  getters: {
    getMenus: (state) => state.menus,
    username: (state) => state.userInfo.username,
    avatar: (state) => state.userInfo.avatar,
  },
  actions: {
    /**
     * Queries and updates the user's permissions, including menus and buttons.
     */
    async queryPermission() {
      try {
        if (this.permissionFetched) {
          return
        }
        const res = await queryPermissionApi({})
        console.log(res, '-----------')
        this.menus = res.data
        this.permissionFetched = true
      } catch (error) {
        this.menus = {}
      }
    },
    async checkPermission(to: RouteLocationNormalized) {
      if (to.name && this.menus[to.name]) {
        return true
      } else {
        return false
      }
    },
    async setUserInfo(userInfo: UserInfo) {
      this.userInfo = {
        ...this.userInfo,
        ...userInfo,
      }
    },
    logout() {
      this.userInfo = {
        id: '',
        name: '',
        username: '',
        email: '',
        phone: '',
        avatar: '',
        department: '',
        role: '',
      }
      this.menus = {}
      this.permissionFetched = false
    },
  },
  // 持久化存储插件其他配置
  persist: {
    // 修改存储中使用的键名称，默认为当前 Store的 id
    key: 'storekey',
    // 修改为 sessionStorage，默认为 localStorage
    storage: window.sessionStorage,
    // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
    pick: ['userInfo', 'permission', 'menus'],
  } as PersistenceOptions,
})

export default useUserStore
