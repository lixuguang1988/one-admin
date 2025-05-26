<template>
  <a-space>
    <a-dropdown>
      <a-button type="text" @click.prevent size="large">
        <a-space size="small">
          <a-avatar size="small" :src="avatar"> </a-avatar><span>{{ username }}</span>
        </a-space>
      </a-button>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="0">
            <span> 退出登录 </span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-space>
</template>

<script setup>
import useUserStore from '@/stores/useUserStore'
import { useRouter } from 'vue-router'
import { avatarUrl } from '@/config/index'
const userStore = useUserStore()
const router = useRouter()

const username = userStore.username
const avatar = userStore.avatar || avatarUrl

const handleMenuClick = (e) => {
  if (e.key === '0') {
    userStore.logout()
    router.push('/login')
  }
}
</script>
