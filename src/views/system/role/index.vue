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
            <a-form-item label="角色名称" name="roleName">
              <a-input v-model:value="formData.roleName" placeholder="请输入用户名" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="span" :offset="isWide ? span * 2 : span">
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
        :loading="loading"
        rowKey="id"
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
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="handleManageUser(record)">人员管理</a-button>
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
        <!-- <template #expandedRowRender="{ record }">
          <p style="margin: 0">
            {{ record.description }}
          </p>
        </template> -->
      </a-table>
    </a-card>

    <edit-form v-model:visible="visible" :formData="editObject" @onSuccess="queryDataSource()">
    </edit-form>

    <user-table v-model:visible="userVisible" :formData="editObject" @onSuccess="queryDataSource()">
    </user-table>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { SyncOutlined } from '@ant-design/icons-vue'

import { queryListApi, deleteOneApi } from '@/api/user/role'
import { resizeColumn } from '@/utils/tools'
import useFormFields from '@/hooks/useFormFields'
import EditForm from './components/Edit.vue'
import CustomColumn from '@/components/customColumn/index.vue'
import UserTable from './components/User.vue'

const dataSource = ref([])
const loading = ref(false)
const total = ref(0)
const defaultFormData = {
  currentPage: 1,
  pageSize: 10,
  roleName: '',
}
const formData = reactive({
  ...defaultFormData,
})

const defaultColumns = [
  {
    dataIndex: 'id',
    key: 'id',
    resizable: false,
    width: 80,
    title: '角色ID',
    align: 'center',
  },
  {
    dataIndex: 'roleName',
    key: 'roleName',
    resizable: true,
    width: 260,
    title: '角色名称',
  },
  {
    dataIndex: 'description',
    key: 'description',
    resizable: true,
    minWidth: 150,
    title: '描述',
  },
  {
    key: 'action',
    title: ' ',
    width: 280,
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

const queryDataSource = async () => {
  try {
    loading.value = true
    const res = await queryListApi(formData)
    if (res.data) {
      dataSource.value = res.data.list || []
      total.value = res.data.total
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
  roleName: '',
  description: '',
  permission: [],
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

const userVisible = ref(false)
const handleManageUser = (record) => {
  editObject.value = {
    ...record,
  }
  userVisible.value = true
}

onMounted(() => {
  queryDataSource()
})
</script>
