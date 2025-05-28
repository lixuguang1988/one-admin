<template>
  <div class="user-index page-index">
    <a-card :bordered="false">
      <a-form
        :model="formData"
        :layout="layout"
        :labelCol="{ flex: '0 0 120px' }"
        autocomplete="off"
        class="page-index-filter"
      >
        <a-row :gutter="gutter">
          <a-col :span="span">
            <a-form-item label="所属栏目" name="columnId">
              <a-input v-model:value="formData.columnId" placeholder="请输入关键字" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="span">
            <a-form-item label="发布状态" name="username">
              <a-select
                v-model:value="formData.status"
                placeholder="全部"
                allow-clear
                @change="queryDataSource"
              >
                <a-select-option v-for="(value, key) in status" :value="key">{{
                  value
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="span">
            <a-form-item label="关键字" name="keyword">
              <a-input v-model:value="formData.keyword" placeholder="请输入关键字" allow-clear />
            </a-form-item>
          </a-col>

          <a-col :span="span" :offset="isWide ? 0 : 2 * span">
            <a-form-item>
              <a-space class="generic-align-end">
                <a-button type="default" @click="hanlderReset">重置</a-button>
                <a-button type="primary" @click="queryDataSource">查询</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <a-row class="generic-margin-bottom">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleStart">新增</a-button>
            <a-button
              v-if="rowSelection.selectedRowKeys.length"
              type="default"
              danger
              @click="handleBatchDelete"
              >删除</a-button
            >
          </a-space>
        </a-col>
        <a-col :span="12" class="generic-align-end">
          <a-space size="middle">
            <a-tooltip title="刷新">
              <SyncOutlined @click="queryDataSource" />
            </a-tooltip>
            <CustomColumn v-model:columns="columns" />
          </a-space>
        </a-col>
      </a-row>
      <a-table
        :columns="tableColumns"
        :data-source="dataSource"
        :pagination="{
          total: total,
          current: formData.currentPage,
          pageSize: formData.pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30', '40'],
          showTotal: (total, range) => `共 ${total} 条记录 第 ${range[0]}-${range[1]} 条`,
          onChange: (page, pageSize) => {
            formData.currentPage = page
            formData.pageSize = pageSize
            queryDataSource()
          },
        }"
        :row-selection="rowSelection"
        :loading="loading"
        :expand-column-width="60"
        :scroll="{ x: 1400 }"
        rowKey="id"
        :sticky="{ offsetHeader: headerHeight }"
        @resizeColumn="resizeColumn"
      >
        <!-- <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span>
            <smile-outlined />
            Name
          </span>
        </template>
      </template> -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'picture'">
            <img
              v-if="record.picture"
              :src="record.picture"
              style="width: 100%; max-height: 100px"
            />
          </template>
          <template v-if="column.key === 'columnName'">
            <span v-for="(item, index) in record.columnList"
              >{{ index !== 0 ? ', ' : '' }}{{ item.name }}</span
            >
          </template>
          <template v-if="column.key === 'status'">
            {{ status[record.status] }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="primary" @click="handleEdit(record)">修改</a-button>
              <a-button type="primary" danger @click="deleteUser(record.id)">删除</a-button>
            </a-space>
          </template>
        </template>
        <!-- <template #expandColumnTitle>
          <span>简介</span>
        </template> -->
        <template #expandedRowRender="{ record }">
          <p style="margin: 0">
            {{ record.description }}
          </p>
        </template>
      </a-table>
    </a-card>

    <edit-form v-model:visible="visible" :formData="editObject" @onSuccess="queryDataSource()">
    </edit-form>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { SyncOutlined, SettingOutlined } from '@ant-design/icons-vue'

import { queryListApi, deleteOneApi, batchDeleteApi } from '@/api/news/index'
import { resizeColumn } from '@/utils/tools'
import useFormFields from '@/hooks/useFormFields'
import { status } from './config'
import EditForm from './components/Edit.vue'
import CustomColumn from '@/components/customColumn/index.vue'
import { headerHeight } from '@/config/index'

const dataSource = ref([])
const loading = ref(false)
const total = ref(0)
const defaultFormData = {
  currentPage: 1,
  pageSize: 10,
  keyword: '',
  status: undefined,
}
const formData = reactive({
  ...defaultFormData,
})
const rowSelection = reactive({
  selectedRowKeys: [],
  onChange: (selectedRowKeys, selectedRows) => {
    rowSelection.selectedRowKeys = selectedRowKeys
  },
  // getCheckboxProps: (record) => ({
  //   disabled: record.status === 2,
  // }),
})

const defaultColumns = [
  {
    dataIndex: 'weight',
    key: 'weight',
    width: 80,
    title: '权重',
    fixed: 'left',
  },
  {
    dataIndex: 'title',
    key: 'title',
    resizable: true,
    width: 240,
    title: '标题',
  },
  {
    dataIndex: 'picture',
    key: 'picture',
    width: 120,
    title: '头图',
  },
  {
    dataIndex: 'description',
    key: 'description',
    resizable: true,
    width: 240,
    title: '简介',
  },
  {
    dataIndex: 'status',
    key: 'status',
    width: 120,
    title: '发布状态',
  },
  {
    dataIndex: 'columnName',
    key: 'columnName',
    minWidth: 150,
    title: '所属栏目',
  },
  {
    dataIndex: 'updater',
    key: 'updater',
    minWidth: 150,
    title: '更新人',
  },
  {
    dataIndex: 'updated_at',
    key: 'updatedAt',
    minWidth: 150,
    title: '更新时间',
  },
  {
    key: 'action',
    title: ' ',
    width: 150,
    _title: '操作',
    fixed: 'right',
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

const queryDataSource = async () => {
  try {
    loading.value = true
    const res = await queryListApi(formData)
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

const handleBatchDelete = async (id) => {
  Modal.confirm({
    title: '提示',
    // icon: createVNode(ExclamationCircleOutlined),
    content: '确定要批量删除吗?',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      return new Promise(async (resolve, reject) => {
        try {
          await batchDeleteApi({ idList: rowSelection.selectedRowKeys })
          message.success('删除成功')
          resolve(true)
          rowSelection.selectedRowKeys = []
          queryDataSource()
        } catch (error) {
          reject()
          message.warning('删除失败')
        }
      }).catch(() => {})
    },
  })
}

/********************** 新增修改 **********************/
const defaultEditData = {
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
