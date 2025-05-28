<template>
  <div class="user-index page-index">
    <a-card :bordered="false">
      <a-row class="generic-margin-bottom">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleStart">新增</a-button>
          </a-space>
        </a-col>
        <a-col :span="12" class="generic-align-end">
          <a-space size="middle">
            <a-tooltip title="刷新">
              <SyncOutlined @click="queryDataSource()" />
            </a-tooltip>
            <CustomColumn v-model:columns="columns" />
          </a-space>
        </a-col>
      </a-row>
      <a-table
        :columns="tableColumns"
        :data-source="dataSource"
        :pagination="false"
        :loading="loading"
        :indentSize="0"
        rowKey="id"
        @resizeColumn="resizeColumn"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space :size="0">
              <a-button type="link" @click="handleEdit(record)">修改</a-button>
              <template v-if="record.parentId">
                <a-popconfirm
                  placement="topRight"
                  title="确定要删除这条记录吗?"
                  :icon="null"
                  @confirm="handleDelete(record.id)"
                >
                  <a-button type="link" danger @click="">删除</a-button>
                </a-popconfirm>
              </template>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <edit-form v-model:visible="visible" :formData="editObject" @onSuccess="queryDataSource">
    </edit-form>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed, nextTick } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { SyncOutlined } from '@ant-design/icons-vue'

import { queryListApi, deleteOneApi } from '@/api/product/dict'
import { resizeColumn, expandedColumn } from '@/utils/tools'
import useFormFields from '@/hooks/useFormFields'
import EditForm from './components/Edit.vue'
import CustomColumn from '@/components/customColumn/index.vue'

const dataSource = ref([])
const loading = ref(false)
const total = ref(0)
const defaultFormData = {
  currentPage: 1,
  pageSize: 10,
  name: '',
  code: '',
}
const formData = reactive({
  ...defaultFormData,
})

const defaultColumns = [
  {
    dataIndex: 'id',
    key: 'id',
    resizable: true,
    minWidth: 64,
    title: 'ID',
  },
  {
    dataIndex: 'name',
    key: 'name',
    resizable: true,
    minWidth: 150,
    title: '字段名称',
  },
  {
    dataIndex: 'code',
    key: 'code',
    resizable: true,
    minWidth: 150,
    title: '字段编码',
  },
  // {
  //   dataIndex: 'parentName',
  //   key: 'parentName',
  //   resizable: true,
  //   minWidth: 150,
  //   title: '父级字段',
  // },
  {
    dataIndex: 'description',
    key: 'description',
    title: '字段简介',
  },
  {
    key: 'action',
    title: ' ',
    width: 150,
    _title: '操作',
  },
]

const columns = ref(defaultColumns)
const tableColumns = computed(() => {
  return columns.value.filter((item) => {
    return item.checked !== false
  })
})

const { toggleCollapsed, showFields, span, layout, gutter, isWide } = useFormFields()

const hanlderReset = () => {
  Object.assign(formData, { ...defaultFormData })
  queryDataSource()
}

const queryDataSource = async (expandId) => {
  try {
    loading.value = true
    const res = await queryListApi({})
    if (res.data) {
      dataSource.value = res.data

      // 展开制定行
      if (expandId) {
        nextTick(() => {
          expandedColumn(expandId)
        })
      }
    }
    loading.value = false
  } catch (error) {
    loading.value = false
    console.log(error)
  }
}

const handleDelete = async (id) => {
  try {
    await deleteOneApi(id)
    message.success('删除成功')
    queryDataSource()
  } catch (error) {
    message.warning('删除失败')
  }
}

/********************** 新增修改 **********************/
const defaultEditData = {
  id: '',
  code: '',
  name: '',
  parentName: '',
  parentcode: '',
}
const visible = ref(false)
const editObject = ref({
  ...defaultEditData,
})

const handleStart = () => {
  editObject.value = {
    ...defaultEditData,
  }
  visible.value = true
}

const handleEdit = (record) => {
  editObject.value = {
    ...record,
  }
  visible.value = true
}

onMounted(() => {
  queryDataSource()
})
</script>
