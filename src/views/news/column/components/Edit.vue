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
        <a-form-item label="栏目名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入栏目名称" />
        </a-form-item>

        <a-form-item label="栏目编码" name="code">
          <a-input v-model:value="formState.code" placeholder="请输入栏目编码" />
        </a-form-item>
        <a-form-item label="栏目简介" name="description">
          <a-textarea
            v-model:value="formState.description"
            placeholder="请输入栏目简介"
            :spellcheck="false"
          />
        </a-form-item>

        <a-form-item label="父级栏目" name="parentId">
          <a-tree-select
            v-model:value="formState.parentId"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择父级栏目"
            allow-clear
            tree-default-expand-all
            :tree-data="treeData"
            :fieldNames="{ value: 'id', label: 'name', children: 'children' }"
            tree-node-filter-prop="name"
          >
            <!-- <template #title="{ value: val, label }">
              <b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
              <template v-else>{{ label }}</template>
            </template> -->
          </a-tree-select>
          <!-- <a-select v-model:value="formState.parentCode" mode="multiple" placeholder="">
            <a-select-option v-for="(label, value) in columnData" :key="index" :value="value">{{
              label
            }}</a-select-option>
          </a-select> -->
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { addOneApi, updateOneApi, queryTreeApi } from '@/api/news/column'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
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
    formState.value = newVal
  },
)
const handleCancel = () => {
  modelVisible.value = false
  loading.value = false
}

const rules = {
  name: [{ required: true, message: '请输入栏目名称', trigger: 'change' }],
  code: [{ required: true, message: '请输入栏目编码', trigger: 'change' }],
}

const validateForm = () => {
  return new Promise((resolve, reject) => {})
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
        parentId: formState.value.parentId || null,
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

const treeData = ref([])

const queryPermission = async () => {
  // if (treeData.value.length) {
  //   return
  // }
  try {
    const res = await queryTreeApi({})
    console.log('*********************', res)

    treeData.value = res.data
  } catch (error) {
    console.log(error)
  }
}

// const columnData = ref([])
</script>
