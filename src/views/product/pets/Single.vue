<template>
  <div class="single-wrapper">
    <a-form
      :model="formState"
      :rules="rules"
      layout="vertical"
      ref="formRef"
      autocomplete="off"
      name="singleForm"
      class="single-form"
    >
      <a-card title="基础信息" :bordered="false">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="宠物名称" name="name">
              <a-input v-model:value="formState.name" :maxlength="32"> </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="价格" name="price">
              <a-input-number
                v-model:value="formState.price"
                :min="0"
                :precision="2"
                style="width: 240px"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item label="简介" name="description">
              <Editor v-model:content="formState.description" type="simple"></Editor>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="照片" name="picture">
              <a-upload
                v-model:file-list="fileList"
                name="file"
                list-type="picture-card"
                :action="uploadURI"
                :headers="{
                  Authorization: getToken(),
                }"
                :isImageUrl="() => true"
                :before-upload="beforeUpload"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div>
                  <plus-outlined></plus-outlined>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="颜色" name="color">
              <a-space>
                <a-radio-group v-model:value="formState.color">
                  <a-radio v-for="item in colorList" :value="item.id">{{ item.name }}</a-radio>
                  <a-radio :value="9999">其他</a-radio>
                </a-radio-group>
                <a-input v-if="formState.color === 9999" v-model:value="formState.colorName" />
              </a-space>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="品种" name="type">
              <a-radio-group v-model:value="formState.type">
                <a-radio v-for="item in classList" :value="item.id">{{ item.name }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-button style="margin-right: 8px" @click="handleCancel">取消</a-button>
            <a-button type="primary" @click="handleOk">确定</a-button>
          </a-col>
        </a-row>
      </a-card>
    </a-form>

    <preview-picture v-model:visible="previewVisible" :fileList="fileList" :index="previewIndex">
    </preview-picture>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, toRaw, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message, Form } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { queryChildDictApi } from '@/api/product/dict'
import { addOneApi, updateOneApi, queryOneApi } from '@/api/product/pets'
import { uploadURI } from '@/api/common'
import { beforeUpload, getBase64 } from '@/utils/tools'
import { getToken } from '@/utils/auth'
// Import styles
import Editor from '@/components/editor/Common.vue'
import PreviewPicture from '@/components/preview/Picture.vue'
// import { status } from '../config'

const useForm = Form.useForm
const router = useRouter()
const route = useRoute()

const defaultForm = {
  name: '',
  price: undefined,
  description: '',
  color: '',
  type: '',
}

const formState = reactive({
  ...defaultForm,
})
const loading = ref(false)
const formRef = ref(null)
const colorList = ref([])
const classList = ref([])

onMounted(() => {
  queryDictData(1, (data) => {
    colorList.value = data
  })
  queryDictData(5, (data) => {
    classList.value = data
  })
})

const validateContent = async (_rule, value) => {
  if (!formState.description) {
    return Promise.reject('请输入正文')
  } else {
    return Promise.resolve()
  }
}
const rules = {
  name: [{ required: true, trigger: 'change' }],
  description: [{ validator: validateContent, trigger: 'change' }],
}

const { resetFields, validate, validateInfos } = useForm(formState, rules, {
  onValidate: (...args) => console.log(...args),
})

const handleOk = async () => {
  validate()
    .then(async (fields) => {
      console.log(fields, toRaw(formState))
      try {
        loading.value = true
        const methodApi = route.params.id ? updateOneApi : addOneApi
        await methodApi({
          ...toRaw(formState),
          id: route.params.id,
          pictures: fileList.value
            .map((item) => item.url)
            .filter(Boolean)
            .join(';'),
        })
        message.success(route.params.id ? '修改成功' : '添加成功')
        router.replace({
          path: '/product/pets',
        })
      } catch (error) {
        message.warning(error.message)
      } finally {
        loading.value = false
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

const handleCancel = () => {
  router.replace({
    path: '/product/pets',
  })
}

const fileList = ref([])
const handleChange = (info) => {
  console.log(fileList.value, info)
  if (info.file.status === 'done') {
    const url = info.file.response.data.url
    fileList.value = fileList.value.map((item) => {
      if (item.uid === info.file.uid) {
        item.url = url
      }
      return item
    })
  }
  if (info.file.status === 'error') {
    message.error('upload error')
  }
}

const queryDictData = async (parentId, callback) => {
  try {
    const res = await queryChildDictApi(parentId)
    console.log('*********************', res)
    callback(res.data)
  } catch (error) {
    console.log(error)
  }
}

const queryData = async (id) => {
  try {
    const res = await queryOneApi(id)
    console.log('*********************', res)
    Object.assign(formState, res.data)
    let ticketId = 3003
    fileList.value = res.data.pictures.split(';').map((item) => {
      const uid = ticketId++
      return {
        url: item,
        thumbUrl: item,
        id: uid,
        uid: uid,
      }
    })
  } catch (error) {
    console.log(error)
  }
}

watch(
  () => route.params.id,
  async (id) => {
    if (id) {
      queryData(id)
    } else {
      Object.assign(formState, { ...defaultForm })
    }
  },
  {
    immediate: true,
  },
)

const previewIndex = ref(0)
const previewVisible = ref(false)
const handlePreview = async (file) => {
  previewIndex.value = fileList.value.findIndex((item) => item.uid === file.uid)
  console.log('previewIndex', previewIndex.value)
  previewVisible.value = true
}
</script>
