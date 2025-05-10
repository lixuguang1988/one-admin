<template>
  <div class="modal-table-wrapper">
    <a-modal
      v-model:open="modelVisible"
      title="人员管理"
      :maskClosable="false"
      :footer="null"
      :width="760"
      destoryOnClose
      @cancel="handleCancel"
    >
      <a-card :bordered="true">
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
          rowKey="id"
          @resizeColumn="resizeColumn"
        >
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.key === 'action'">
              <a-space v-if="!editableData[record.id]">
                <a-button type="text" danger @click="deleteUser(record.id)">删除</a-button>
              </a-space>
            </template>
            <template v-else-if="column.key === 'username'">
              <div>
                <template v-if="editableData[record.id]">
                  <a-select
                    v-model:value="editableData[record.id].searchKey"
                    show-search
                    placeholder="请输入关键字选择用户"
                    style="width: 200px"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    :options="editableData[record.id].options"
                    @search="(val) => handleSearch(val, record.id)"
                    @change="(val) => handleChange(val, record.id)"
                  ></a-select>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>
            <!-- <template v-else>{{ text || '--' }}</template> -->
          </template>
        </a-table>
      </a-card>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { queryUserListApi, deleteUserApi, batchDeleteUserApi } from '@/api/user'
import { addRoleOneApi, queryRoleListApi, deleteRoleOneApi } from '@/api/user/role'
import { resizeColumn } from '@/utils/tools'
import { debounce } from 'lodash'

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

const dataSource = ref([])
const editableData = reactive({})
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
  getCheckboxProps: (record) => ({
    disabled: typeof record.id === 'string' && record.id.startsWith('id'),
  }),
})

const defaultColumns = [
  // {
  //   dataIndex: 'id',
  //   key: 'id',
  //   resizable: true,
  //   width: 42,
  // },
  {
    dataIndex: 'username',
    key: 'username',
    resizable: true,
    minWidth: 150,
    title: '姓名',
  },
  {
    dataIndex: 'phone',
    key: 'phone',
    resizable: true,
    minWidth: 150,
    title: '手机号',
  },
  {
    key: 'action',
    dataIndex: 'action',
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

let id = 1001
const handleStart = () => {
  const mockData = {
    id: 'id_' + id++,
    name: '',
    phone: '',
    searchKey: undefined,
    options: [],
  }
  dataSource.value.unshift(mockData)
  editableData[mockData.id] = mockData
  console.log(editableData)
}

const hanlderReset = () => {
  Object.assign(formData, { ...defaultFormData })
  queryDataSource()
}

const queryDataSource = async () => {
  try {
    loading.value = true
    const res = await queryRoleListApi({ ...formData, roleId: props.formData.id })
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
          await deleteRoleOneApi({ userId: id, roleId: props.formData.id })
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
          await batchDeleteUserApi({ idList: rowSelection.selectedRowKeys })
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

const modelVisible = ref(props.visible)
watch(
  () => props.visible,
  (newVal) => {
    modelVisible.value = newVal
    if (newVal) {
      queryDataSource()
    }
  },
)
watch(modelVisible, (newVal) => {
  emit('update:visible', newVal)
})

const handleCancel = () => {
  modelVisible.value = false
}

const handleSearch = (val, id) => {
  console.log(val)
  remoteSearch(val, id)
}
const handleChange = async (val, id) => {
  console.log(val, '***********************')
  try {
    const res = await addRoleOneApi({ roleId: props.formData.id, userId: val })
    const item = editableData[id].options.find((item) => item.value === val)
    const index = dataSource.value.findIndex((item) => item.id === id)
    dataSource.value.splice(index, 1, item.data)
    delete editableData[id]
  } catch (error) {
    message.warning(error.message)
  }
}

const remoteSearch = debounce(async (val, id) => {
  try {
    const res = await queryUserListApi({ currentPage: 1, pageSize: 10, keyword: val, status: 1 })
    if (res.data) {
      editableData[id].options = res.data.list.map((item) => {
        return {
          value: item.id,
          label: item.username,
          data: item,
        }
      })
    }
  } catch (error) {
    editableData[id].options = []
  }
}, 200)
</script>
