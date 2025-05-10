import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Antd, { message } from 'ant-design-vue'
// import Idux from './idux'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'ant-design-vue/dist/reset.css'
import '@/styles/main.less'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
// app.use(Idux)
app.use(Antd)
app.mount('#app')

app.config.globalProperties.$router = router
app.config.globalProperties.$message = message
