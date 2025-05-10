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
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 15 }"
        :rules="rules"
        ref="formRef"
        autocomplete="off"
        name="editForm"
        class="edit-form"
      >
        <a-form-item label="菜单名称" name="menuName">
          <a-input v-model:value="formState.menuName" />
        </a-form-item>

        <a-form-item name="menuCode">
          <template #label>
            <a-space :size="2">
              菜单编码
              <a-tooltip title="菜单编码要与路由name对应">
                <ExclamationCircleOutlined style="opacity: 0.5" />
              </a-tooltip>
            </a-space>
          </template>
          <a-input v-model:value="formState.menuCode" />
        </a-form-item>

        <a-form-item label="按钮权限" name="operation">
          <a-select v-model:value="formState.operation" mode="multiple">
            <a-select-option v-for="(label, value) in operation" :key="index" :value="value">{{
              label
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { addPermissioApi, updatePermissionApi } from '@/api/user/permission'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { operation } from '../config'
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

const rules = {
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'change' }],
  menuCode: [{ required: true, message: '请输入菜单编码', trigger: 'change' }],
}

const validateForm = () => {
  return new Promise((resolve, reject) => {})
}

const handleOk = async () => {
  formRef.value?.validate().then(async (fields) => {
    console.log(fields)
    try {
      loading.value = true
      const methodApi = formState.value.id ? updatePermissionApi : addPermissioApi
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
