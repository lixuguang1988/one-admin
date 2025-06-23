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
            <a-form-item label="菜单名称" name="menuName">
              <a-input v-model:value="formData.menuName" placeholder="请输入用户名" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="span">
            <a-form-item label="菜单编码" name="menuCode">
              <a-input v-model:value="formData.menuCode" placeholder="请输入用户名" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="span" :offset="isWide ? span : 0">
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
        :pagination2="{
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
        :pagination="false"
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
          <template v-if="column.key === 'operation'">
            <a-tag v-for="item in record.operation" :color="operationColor[item]">{{
              operation[item]
            }}</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="primary" @click="handleEdit(record)">修改</a-button>
              <a-button type="primary" danger @click="handleDelete(record.id)">删除</a-button>
            </a-space>
          </template>
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
import { SyncOutlined } from '@ant-design/icons-vue'

import { queryPermissionListApi, deletePermissionApi } from '@/api/user/permission'
import { resizeColumn } from '@/utils/tools'
import useFormFields from '@/hooks/useFormFields'
import { operation, operationColor } from './config'
import EditForm from './components/Edit.vue'
import CustomColumn from '@/components/customColumn/index.vue'

const dataSource = ref([])
const loading = ref(false)
const total = ref(0)
const defaultFormData = {
  currentPage: 1,
  pageSize: 10,
  menuName: '',
  menuCode: '',
}
const formData = reactive({
  ...defaultFormData,
})

const defaultColumns = [
  {
    dataIndex: 'menuName',
    key: 'menuName',
    // resizable: true,
    minWidth: 150,
    title: '菜单名称',
  },
  {
    dataIndex: 'menuCode',
    key: 'menuCode',
    // resizable: true,
    minWidth: 150,
    title: '菜单编码',
  },
  {
    dataIndex: 'operation',
    key: 'operation',
    // resizable: true,
    minWidth: 150,
    title: '按钮权限',
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

const queryDataSource = async () => {
  try {
    loading.value = true
    const res = await queryPermissionListApi(formData)
    if (res.data) {
      dataSource.value = res.data.list || []
      total.value = res.data.total
    }
    loading.value = false
  } catch (error) {
    console.log(error)
  }
}

const handleDelete = async (id) => {
  Modal.confirm({
    title: '提示',
    // icon: createVNode(ExclamationCircleOutlined),
    content: '确定要删除吗?',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      return new Promise(async (resolve, reject) => {
        try {
          await deletePermissionApi(id)
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

/********************** 新增修改 **********************/
const defaultEditData = {
  id: '',
  menuCode: '',
  menuName: '',
  operation: [],
  parentId: '',
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
