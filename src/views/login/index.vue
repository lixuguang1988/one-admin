<template>
  <div class="login">
    <a-form
      :model="formState"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      :rules="rules"
      autocomplete="off"
      name="loginForm"
      class="login-form"
      @finish="handleLogin"
      @finishFailed="onFinishFailed"
    >
      <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
        <a-typography-title :level="3" style="margin-top: 24px">用户登录</a-typography-title>
      </a-form-item>
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { AbstractControl, ValidateErrors, Validators, useFormGroup } from '@idux/cdk/forms'
import { RouterLink } from 'vue-router'
import { loginApi } from '@/api/user/index'
import { setToken } from '@/utils/auth'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { reactive } from 'vue'
import useUserStore from '@/stores/useUserStore'

const router = useRouter()
const userStore = useUserStore()

interface FormState {
  username: string
  password: string
  remember: boolean
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
})

const checkAge = async (_rule: Rule, value: number) => {
  if (!value) {
    return Promise.reject('Please input the age')
  }
  if (!Number.isInteger(value)) {
    return Promise.reject('Please input digits')
  } else {
    if (value < 18) {
      return Promise.reject('Age must be greater than 18')
    } else {
      return Promise.resolve()
    }
  }
}
const validateUser = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入用户名')
  } else {
    return Promise.resolve()
  }
}
const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入密码')
  } else {
    return Promise.resolve()
  }
}

const rules: Record<string, Rule[]> = {
  username: [{ validator: validateUser, trigger: 'change' }],
  password: [{ validator: validatePass, trigger: 'change' }],
}

const handleLogin = async (values) => {
  try {
    const res = await loginApi(values)
    console.log('res', res)
    setToken(res.data.token) // 更新token
    userStore.setUserInfo(res.data) // 更新store
    router.push({ path: '/' }) // 跳转到首页
  } catch (error) {
    message.error(error.message)
    console.log('Login failed:', error)
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>

<style scoped lang="less">
@import url('./login.less');
</style>
