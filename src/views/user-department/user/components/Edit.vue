<template>
  <div class="edit-form-wrapper">
    <a-modal
      v-model:open="modelVisible"
      :title="formState.id ? '编辑' : '新增'"
      :maskClosable="false"
      :confirmLoading="loading"
      destoryOnClose
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <a-form
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :rules="rules"
        ref="formRef"
        autocomplete="off"
        name="editForm"
        class="edit-form"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="formState.phone" />
        </a-form-item>

        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { addUserApi, updateUserApi } from '@/api/user'
import { rules as validatorRules } from '@/utils/tools'
// import { status } from '../config'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  formData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:visible', 'onSuccess'])

const modelVisible = ref(props.visible)
const formState = ref(props.formData)
const loading = ref(false)
const formRef = ref(null)
watch(
  () => props.visible,
  (newVal) => {
    modelVisible.value = newVal
  },
)
watch(modelVisible, (newVal) => {
  emit('update:visible', newVal)
})

watch(
  () => props.formData,
  (newVal) => {
    formState.value = newVal
  },
)
const handleCancel = () => {
  modelVisible.value = false
  loading.value = false
}

const validateUser = async (_rule, value) => {
  if (!value) {
    return Promise.reject('请输入用户名')
  } else {
    return Promise.resolve()
  }
}
const validatePhone = async (_rule, value) => {
  if (!value) {
    return Promise.reject('请输入手机号')
  } else if (!validatorRules.phone.test(value)) {
    return Promise.reject('请输入正确的手机号')
  } else {
    return Promise.resolve()
  }
}

const validateEmail = async (_rule, value) => {
  if (!value) {
    return Promise.reject('请输入邮箱地址')
  } else if (!validatorRules.email.test(value)) {
    return Promise.reject('请输入正确的邮箱地址')
  } else {
    return Promise.resolve()
  }
}

const rules = {
  username: [{ validator: validateUser, trigger: 'change' }],
  phone: [{ validator: validatePhone, trigger: 'change' }],
  email: [{ validator: validateEmail, trigger: 'change' }],
}

const validateForm = () => {
  return new Promise((resolve, reject) => {})
}

const handleOk = async () => {
  formRef.value?.validate().then(async (fields) => {
    console.log(fields)
    try {
      loading.value = true
      const methodApi = formState.value.id ? updateUserApi : addUserApi
      await methodApi({
        ...fields,
        id: formState.value.id,
      })
      handleCancel()
      emit('onSuccess')
    } catch (error) {
      message.warning(error.message)
    } finally {
      loading.value = false
    }
  })
}
</script>
