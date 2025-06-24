<template>
  <div class="single-wrapper">
    <a-card v-model:open="modelVisible" :title="formState.id ? '新闻编辑' : '新闻新增'">
      <a-form
        :model="formState"
        :rules="rules"
        layout="vertical"
        ref="formRef"
        autocomplete="off"
        name="singleForm"
        class="single-form"
      >
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="标题" name="title">
              <a-input v-model:value="formState.title">
                <template #addonBefore>
                  <a-dropdown>
                    <div
                      :style="{
                        background: `url(${colorDefault})`,
                        backgroundSize: '50% 50%',
                        border: '1px solid rgba(0,0,0,.06)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }"
                    >
                      <div
                        :style="{
                          width: '20px',
                          height: '20px',
                          background: formState.color,
                        }"
                      ></div>
                    </div>
                    <template #overlay> <SketchPicker v-model="formState.color" /></template>
                  </a-dropdown>
                </template>
                <template #addonAfter>
                  <a-select
                    v-model:value="formState.priority"
                    placeholder="权重"
                    style="width: 80px"
                    allow-clear
                  >
                    <a-select-option v-for="value in prioritys" :value="value"
                      >{{ value }}#</a-select-option
                    >
                  </a-select>
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="发布状态" name="status">
              <a-radio-group v-model:value="formState.status" button-style="solid">
                <a-radio-button value="1">发布</a-radio-button>
                <a-radio-button value="2">草稿</a-radio-button>
                <a-radio-button value="3">待发布</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="简介" name="description">
              <a-textarea v-model:value="formState.description" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="封面图" name="picture">
              <a-upload
                v-model:file-list="fileList"
                name="file"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :action="uploadURI"
                :headers="{
                  Authorization: getToken(),
                }"
                :before-upload="beforeUpload"
                style="width: 52px; height: 52px"
                @change="handleChange"
              >
                <img
                  v-if="formState.picture"
                  :src="formState.picture"
                  style="width: 100%; max-height: 100%"
                  alt="avatar"
                />
                <div v-else>
                  <loading-outlined v-if="uploading"></loading-outlined>
                  <plus-outlined v-else></plus-outlined>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属栏目" name="columns">
              <a-tree-select
                v-model:value="formState.columns"
                show-search
                tree-checkable
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择所属栏目"
                allow-clear
                tree-default-expand-all
                :tree-data="treeData"
                :fieldNames="{ value: 'id', label: 'name', children: 'children' }"
                tree-node-filter-prop="name"
              >
              </a-tree-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label=" " name="content">
          <Editor v-model:content="formState.content"></Editor>
        </a-form-item>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="来源" name="source">
              <a-input v-model:value="formState.source"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-row>
        <a-col :span="24">
          <a-button style="margin-right: 8px" @click="handleCancel">取消</a-button>
          <a-button type="primary" :loading="loading" @click="handleOk">确定</a-button>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { addOneApi, updateOneApi, queryOneApi } from '@/api/news/index'
import { queryTreeApi } from '@/api/news/column'
import { uploadURI } from '@/api/common'
import { rules as validatorRules, prioritys, beforeUpload, getBase64 } from '@/utils/tools'
import { getToken, clearToken } from '@/utils/auth'
// Import styles
import 'vue-color/style.css'
import { SketchPicker } from 'vue-color'
import colorDefault from '@/assets/background/colorTransparent.png'
import Editor from '@/components/editor/Common.vue'
// import { status } from '../config'

console.log(colorDefault)

const defaultForm = {
  id: '',
  title: '',
  content: '',
  color: '',
  picture: '',
  description: '',
  priority: '',
  status: '',
  source: '',
  columns: [],
}

const router = useRouter()
const route = useRoute()

const formState = ref({ ...defaultForm })
const loading = ref(false)
const formRef = ref(null)

const handleCancel = () => {
  router.replace({
    path: '/news/manage',
  })
}

const validateContent = async (_rule, value) => {
  if (!formState.value.content) {
    return Promise.reject('请输入正文')
  } else {
    return Promise.resolve()
  }
}

const rules = {
  title: [{ required: true, trigger: 'change' }],
  content: [{ validator: validateContent, trigger: 'change' }],
}

const handleOk = async () => {
  formRef.value?.validate().then(async (fields) => {
    console.log(fields)
    try {
      loading.value = true
      const methodApi = formState.value.id ? updateOneApi : addOneApi
      await methodApi({
        ...fields,
        priority: formState.value.priority,
        color: formState.value.color,
        id: formState.value.id,
      })
      handleCancel()
    } catch (error) {
      message.warning(error.message)
    } finally {
      loading.value = false
    }
  })
}

const fileList = ref([])
const uploading = ref(false)
const handleChange = (info) => {
  if (info.file.status === 'uploading') {
    uploading.value = true
    return
  }
  if (info.file.status === 'done') {
    formState.value.picture = info.file.response.data.url
    uploading.value = false
  }
  if (info.file.status === 'error') {
    uploading.value = false
    message.error('upload error')
  }
}

const queryData = async (id) => {
  try {
    const res = await queryOneApi(id)
    console.log('*********************', res)
    formState.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const treeData = ref([])

const queryColumnData = async () => {
  if (treeData.value.length) {
    return
  }
  try {
    const res = await queryTreeApi(undefined, true)
    console.log('*********************', res)
    treeData.value = res.data
  } catch (error) {
    console.log(error)
  }
}

// 监听路由变化
watch(
  () => route.params.id,
  async (id) => {
    if (id) {
      queryData(id)
    } else {
      Object.assign(formState, { ...defaultForm })
    }
    queryColumnData()
  },
  {
    immediate: true,
  },
)
</script>
<style>
.avatar-uploader .ant-upload {
  width: 54px !important;
  height: 54px !important;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
