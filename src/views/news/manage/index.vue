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
            <a-popconfirm title="确定要删除这些记录吗?" :icon="null" @confirm="handleBatchDelete">
              <a-button v-if="rowSelection.selectedRowKeys.length" type="default" danger
                >删除</a-button
              >
            </a-popconfirm>
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
        :scroll="{ x: 1600 }"
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
          <template v-if="column.key === 'title'">
            <div :style="{ color: record.color || 'inherit' }">
              <strong v-if="record.priority">[{{ record.priority }}]</strong>
              <span>{{ record.title }}</span>
            </div>
          </template>
          <template v-if="column.key === 'picture'">
            <img
              v-if="record.picture"
              :src="record.picture"
              style="width: 100%; max-height: 100px"
            />
          </template>
          <template v-if="column.key === 'columnName'">
            <a-tag v-for="(item, index) in record.columnList"
              >{{ index !== 0 ? '' : '' }}{{ item.name }}</a-tag
            >
          </template>
          <template v-if="column.key === 'status'">
            {{ status[record.status] }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space :size="0">
              <a-button type="link" @click="handleEdit(record)">修改</a-button>
              <a-popconfirm
                placement="topRight"
                title="确定要删除这条记录吗?"
                :icon="null"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
        <!-- <template #expandColumnTitle>
          <span>简介</span>
        </template> -->
        <!-- <template #expandedRowRender="{ record }">
          <p style="margin: 0">
            {{ record.description }}
          </p>
        </template> -->
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { SyncOutlined, SettingOutlined } from '@ant-design/icons-vue'

import { queryListApi, deleteOneApi, batchDeleteApi } from '@/api/news/index'
import { resizeColumn } from '@/utils/tools'
import { formatDatetime } from '@/utils/format'
import useFormFields from '@/hooks/useFormFields'
import { status } from './config'
import CustomColumn from '@/components/customColumn/index.vue'
import { headerHeight } from '@/config/index'

const router = useRouter()

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
    dataIndex: 'title',
    key: 'title',
    resizable: true,
    width: 200,
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
    width: 150,
    title: '所属栏目',
  },
  {
    dataIndex: 'updater',
    key: 'updater',
    width: 150,
    title: '更新人',
  },
  {
    dataIndex: 'updated_at',
    key: 'updatedAt',
    width: 200,
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
      dataSource.value = (res.data.list || []).map((item) => {
        return {
          ...item,
          updated_at: formatDatetime(item.updated_at),
        }
      })
      total.value = res.data.total
    }
  } catch (error) {
    message.warning(error.message)
  } finally {
    loading.value = false
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

const handleBatchDelete = async (id) => {
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
}

/********************** 新增修改 **********************/

const handleStart = () => {
  router.push({
    path: '/news/single/',
  })
}

const handleEdit = (record) => {
  router.push({
    path: '/news/single/' + record.id,
  })
}

onMounted(() => {
  queryDataSource()
})
</script>
