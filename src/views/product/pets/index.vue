<template>
  <div class="user-index page-index">
    <a-card :bordered="false" class="generic-margin-bottom">
      <a-form
        :model="formData"
        layout="horizontal"
        :labelCol="{ flex: '0 0 64px' }"
        autocomplete="off"
        class="page-index-filter"
      >
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item label="关键字" name="keyword">
              <a-input
                v-model:value="formData.keyword"
                placeholder="请输入关键字"
                allow-clear
                @blur="queryDataSource"
                @pressEnter="queryDataSource"
              />
            </a-form-item>
          </a-col>

          <a-col :span="24" style="margin-top: 12px">
            <a-form-item label="品种" name="type">
              <a-checkable-tag
                v-model:checked="classAll"
                @change="(checked) => handleCheckedChange('class', 0, checked)"
              >
                全部
              </a-checkable-tag>
              <a-checkable-tag
                v-for="(item, index) in classList"
                :key="item.id"
                v-model:checked="item.checked"
                @change="(checked) => handleCheckedChange('class', item.id, checked)"
              >
                {{ item.name }}
              </a-checkable-tag>
            </a-form-item>
          </a-col>
          <a-col :span="24" style="margin-top: 12px">
            <a-form-item label="颜色" name="color">
              <a-checkable-tag
                v-model:checked="colorAll"
                @change="(checked) => handleCheckedChange('color', 0, checked)"
              >
                全部
              </a-checkable-tag>

              <a-checkable-tag
                v-for="(item, index) in colorList"
                :key="item.id"
                v-model:checked="item.checked"
                @change="(checked) => handleCheckedChange('color', item.id, checked)"
              >
                {{ item.name }}
              </a-checkable-tag>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-spin :spinning="loading">
      <a-row :gutter="24">
        <!-- <576px 12  >768px 8 >1200px 6 -->
        <a-col :xs="12" :sm="8" :xl="6">
          <a-card
            style="height: 240px; border: 1px dashed #d9d9d9; margin-bottom: 24px"
            :bodyStyle="{
              padding: 0,
              display: 'flex',
              'justify-content': 'center',
              'align-items': 'center',
              height: '100%',
            }"
          >
            <a-button type="link" @click="handleStart">
              <template #icon> <PlusOutlined /> </template>新增</a-button
            >
          </a-card>
        </a-col>
        <a-col v-for="item in dataSource" :xs="12" :sm="8" :xl="6" :key="item.id">
          <a-card
            hoverable
            style="height: 240px; margin-bottom: 24px"
            :bodyStyle="{ height: '126px', padding: '12px' }"
          >
            <template #actions>
              <router-link :to="`/product/pet/${item.id}`">修改</router-link>
              <a-popconfirm
                title="确定要删除这条记录吗?"
                :icon="null"
                @confirm="handleDelete(item.id)"
              >
                <a type="link" @click="() => {}"> 删除</a>
              </a-popconfirm>
            </template>
            <template #cover>
              <div class="item-cover">
                <img
                  v-for="(pic, index) in item.picture"
                  style="width: 64px; height: 64px"
                  :key="pic"
                  :src="pic"
                  @click="handlePreview(item, index)"
                />
              </div>
            </template>
            <a-card-meta :title="item.name || item.title">
              <template #description>
                <div class="item-description" v-html="item.description"></div>
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
      <div class="generic-align-center">
        <a-pagination
          :total="total"
          :current="formData.currentPage"
          :page-size="formData.pageSize"
          :page-size-options="['10', '20', '30', '40']"
          show-size-changer2
          @change="
            (page, pageSize) => {
              formData.currentPage = page
              formData.pageSize = pageSize
              queryDataSource()
            }
          "
        >
        </a-pagination>
      </div>
    </a-spin>

    <preview-picture
      v-model:visible="previewVisible"
      :fileList="previewFileList"
      :index="previewIndex"
    >
    </preview-picture>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import PreviewPicture from '@/components/preview/Picture.vue'
import { queryListApi, deleteOneApi, batchDeleteApi } from '@/api/product/pets'
import { queryChildDictApi } from '@/api/product/dict'
import useFormFields from '@/hooks/useFormFields'
import { status } from './config'

const router = useRouter()

const dataSource = ref([])
const loading = ref(false)
const total = ref(0)
const defaultFormData = {
  currentPage: 1,
  pageSize: 10,
  keyword: '',
}
const formData = reactive({
  ...defaultFormData,
})

const queryDataSource = async () => {
  try {
    loading.value = true
    let types = []
    classList.value.forEach((item) => {
      if (item.checked) {
        types.push(item.id)
      }
    })
    let colors = []
    colorList.value.forEach((item) => {
      if (item.checked) {
        colors.push(item.id)
      }
    })
    const res = await queryListApi({
      ...formData,
      types: types.length > 0 ? types : undefined,
      colors: colors.length > 0 ? colors : undefined,
    })
    if (res.data) {
      dataSource.value = res.data.list || []
      total.value = res.data.total
    }
  } catch (error) {
    message.warning(error.message)
  } finally {
    loading.value = false
  }
}

const deleteUser = async (id) => {
  Modal.confirm({
    title: '提示',
    // icon: createVNode(ExclamationCircleOutlined),
    content: '确定要删除吗?',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      return new Promise(async (resolve, reject) => {
        try {
          await deleteOneApi(id)
          message.success('删除成功')
          resolve(true)
          queryDataSource()
        } catch (error) {
          reject()
          message.warning('删除失败')
        }
      }).catch(() => {})
    },
  })
}

const handleStart = () => {
  router.push('/product/pet/')
}

const colorList = ref([])
const classList = ref([])
const classAll = ref(true)
const colorAll = ref(true)
const queryDictData = async (parentId, callback) => {
  try {
    const res = await queryChildDictApi(parentId)
    console.log('*********************', res)
    callback(
      res.data.map((item) => ({
        ...item,
        // checked: false,
      })),
    )
  } catch (error) {
    console.log(error)
  }
}

const handleCheckedChange = (type, id, checked) => {
  if (type === 'class' && checked) {
    if (id === 0) {
      classList.value = classList.value.map((item) => {
        return {
          ...item,
          checked: false,
        }
      })
    } else {
      classAll.value = false
    }
  } else if (type === 'color' && checked) {
    if (id === 0) {
      colorList.value = colorList.value.map((item) => {
        return {
          ...item,
          checked: false,
        }
      })
    } else {
      colorAll.value = false
    }
  } else if (type === 'class' && !checked) {
    if (id !== 0) {
      const hasChecked = classList.value.some((item) => item.checked)
      if (!hasChecked) {
        classAll.value = true
      }
    }
  } else if (type === 'color' && !checked) {
    if (id !== 0) {
      const hasChecked = colorList.value.some((item) => item.checked)
      if (!hasChecked) {
        colorAll.value = true
      }
    }
  }

  formData.currentPage = 1
  queryDataSource()
}

onMounted(() => {
  queryDataSource()
  queryDictData(1, (data) => {
    colorList.value = data
  })
  queryDictData(5, (data) => {
    classList.value = data
  })
})

const previewIndex = ref(0)
const previewVisible = ref(false)
const previewFileList = ref([])
const handlePreview = async (item, index) => {
  previewIndex.value = index
  let ticketId = 3003
  previewFileList.value = item.picture.map((url) => {
    const uid = ticketId++
    return {
      url: url,
      thumbUrl: url,
      id: uid,
      uid: uid,
    }
  })
  console.log('previewIndex', previewIndex.value)
  previewVisible.value = true
}
</script>

<style lang="less" scoped>
.item-description {
  height: 64px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
.item-cover {
  padding: 1px 1px 1px 1px;
  overflow: hidden;
  height: 64px;
  white-space: nowrap;
  img:not(:first-child) {
    border-radius: 0;
    margin-left: 4px;
  }
  img:first-child {
    border-radius: 8px 0 0 0;
  }
}
</style>
