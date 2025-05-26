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
        <a-form-item label="角色名称" name="roleName">
          <a-input v-model:value="formState.roleName" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-input v-model:value="formState.description" />
        </a-form-item>

        <a-form-item label="菜单权限" name="permission">
          <a-tree
            v-model:expandedKeys="tree.expandedKeys"
            v-model:checkedKeys="formState.permission"
            checkable
            :tree-data="tree.data"
          >
          </a-tree>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { queryTreeApi } from '@/api/user/permission'
import { addOneApi, updateOneApi } from '@/api/user/role'
import { operation } from '../../permission/config'

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

const tree = reactive({
  data: [],
  expandedKeys: ['root'],
})

const modelVisible = ref(props.visible)
const formState = ref({ ...props.formData })
const loading = ref(false)
const formRef = ref(null)
watch(
  () => props.visible,
  (newVal) => {
    modelVisible.value = newVal
    if (newVal) {
      queryPermission()
    }
  },
)
watch(modelVisible, (newVal) => {
  emit('update:visible', newVal)
})

watch(
  () => props.formData,
  (newVal) => {
    formState.value = { ...newVal }
  },
)
const handleCancel = () => {
  modelVisible.value = false
  loading.value = false
}

const rules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'change' }],
  // menuCode: [{ required: true, message: '请输入菜单编码', trigger: 'change' }],
}

const handleOk = async () => {
  formRef.value?.validate().then(async (fields) => {
    console.log(fields)
    try {
      loading.value = true
      const methodApi = formState.value.id ? updateOneApi : addOneApi
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

const queryPermission = async () => {
  if (tree.data.length) {
    return
  }
  try {
    const res = await queryTreeApi()
    console.log('*********************', res)

    tree.data = [
      {
        title: '全部权限',
        key: 'root',
        selectable: false,
        children: res.data.map((item) => {
          return {
            title: item.menuName,
            key: item.menuCode,
            selectable: false,
            children: item.operation.map((child) => {
              return {
                title: operation[child],
                key: item.menuCode + '__' + child,
                selectable: false,
              }
            }),
          }
        }),
      },
    ]
  } catch (error) {
    console.log(error)
  }
}
</script>
