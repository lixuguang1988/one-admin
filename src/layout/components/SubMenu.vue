<template>
  <a-sub-menu :key="subItem.key">
    <template #title>
      <span>
        <component v-if="subItem.icon && Icons[subItem.icon]" :is="Icons[subItem.icon]" />
        <span>{{ subItem.label }}</span>
      </span>
    </template>
    <template v-for="item in subItem.children" :key="item.key">
      <a-menu-item v-if="!item.children" :key="item.key">
        <component v-if="item.icon && Icons[item.icon]" :is="Icons[item.icon]" />
        <span>{{ item.label }}</span>
      </a-menu-item>
      <!-- 递归调用自身组件 -->
      <sub-menu v-else :subItem="item"> </sub-menu>
    </template>
  </a-sub-menu>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { routes } from '@/router/index'
import * as Icons from '@ant-design/icons-vue'

defineProps({
  subItem: {
    type: Object,
    default: {
      key: 'submenu',
      icon: 'setting',
      label: 'Sub Menu',
      children: [
        { type: 'item', key: 'submenu1', label: 'Sub Item 1', icon: 'setting' },
        { type: 'item', key: 'submenu2', label: 'Sub Item 2', icon: 'setting' },
      ],
    },
  },
})
</script>
