<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
// import enUS from 'ant-design-vue/es/locale/en_US';
// import dayjs from 'dayjs';
// import 'dayjs/locale/zh-cn';

const getPopupContainer = (el, dialogContext) => {
  if (dialogContext) {
    return dialogContext.getDialogWrap()
  } else {
    return document.body
  }
}
</script>

<template>
  <a-config-provider :getPopupContainer="getPopupContainer" :locale="zhCN">
    <RouterView />
  </a-config-provider>
</template>

<!-- <style scoped></style> -->
