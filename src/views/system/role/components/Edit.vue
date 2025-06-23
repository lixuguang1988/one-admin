<template>
  <div class="edit-form-wrapper">
    <a-modal
      v-model:open="modelVisible"
      :title="formState.id ? '编辑' : '新增'"
      :maskClosable="false"
      :confirmLoading="loading"
      :width="960"
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
        <a-form-item label="角色名称" name="roleName">
          <a-input v-model:value="formState.roleName" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-input v-model:value="formState.description" />
        </a-form-item>

        <a-form-item label="菜单权限" labelAlign="left" :colon="false" name="permission">
        </a-form-item>
        <!-- 重新渲染不会再自动展开，每次获取完数据后重新渲染 -->
        <a-table
          :key="tableKey"
          :columns="columns"
          :data-source="tableData"
          :pagination="false"
          :defaultExpandAllRows="true"
          rowKey="id"
          size="middle"
          :row-selection="rowSelection"
          :scroll="{ y: 500 }"
        >
          <template #bodyCell="{ record, index, column }">
            <template v-if="column.key === 'operation'">
              <a-checkable-tag
                v-for="(item, index) in record.operation"
                :key="item"
                :checked="record.operationChecked.includes(item)"
                :style="{
                  background: record.operationChecked.includes(item)
                    ? operationColor[item]
                    : '#ebebeb',
                }"
                @change="(checked) => handleOperationChange(record, item, checked)"
              >
                {{ operation[item] }}
              </a-checkable-tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <!-- <a-button
                  v-if="record.children && record.children.length > 0"
                  type="link"
                  size="small"
                  @click.prevent="handleAllChecked(record)"
                  >全选子级</a-button
                > -->
                <a-button
                  v-if="
                    record.operation.length > 0 &&
                    record.operation.length !== record.operationChecked.length
                  "
                  type="link"
                  size="small"
                  @click.prevent="handleOperationChecked(record)"
                  >全选按钮</a-button
                >
              </a-space>
            </template>
          </template>
        </a-table>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch, toRaw, unref } from 'vue'
import { message } from 'ant-design-vue'
import { queryTreeApi } from '@/api/user/permission'
import { addOneApi, updateOneApi } from '@/api/user/role'
import { operation, operationColor } from '../../permission/config'

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

const tree = reactive({
  data: [],
  expandedKeys: ['root'],
})

const modelVisible = ref(props.visible)
const formState = ref({ ...props.formData })
const permissionMap = ref({})
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
    if (props.visible) {
      formState.value = { ...newVal }
      permissionMap.value = { ...toRaw(newVal.permission) }
      console.log(permissionMap.value)
    }
  },
)
const handleCancel = () => {
  modelVisible.value = false
  loading.value = false
}

const rules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'change' }],
  // menuCode: [{ required: true, message: '请输入菜单编码', trigger: 'change' }],
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
        permission: collectSelectedPermissions(toRaw(unref(tableData))),
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

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
    key: 'menuName',
  },
  // {
  //   dataIndex: 'menuCode',
  //   key: 'menuCode',
  //   // resizable: true,
  //   minWidth: 150,
  //   title: '菜单编码',
  // },
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
    width: 120,
    _title: '操作',
  },
]

const tableKey = ref(1003)
const tableData = ref([])
const rowSelection = ref({
  checkStrictly: false, // 是否父子联动 false 联动， true不联动
  selectedRowKeys: [],
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    rowSelection.value.selectedRowKeys = selectedRowKeys
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows, 'onSelect')
    if (selected) {
      mapChecked([record], true)
    } else {
      mapChecked([record], false)
    }
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
    if (selected) {
      mapChecked(tableData.value, true)
    } else {
      mapChecked(tableData.value, false)
    }
  },
})

const mapOperations = (data) => {
  return data.map((item) => {
    // 如果 operation 是字符串，则分割为数组
    const operations =
      typeof item.operation === 'string'
        ? item.operation.split(',').filter((op) => op.trim()) // 去除空字符串
        : item.operation || []

    item.operationChecked = permissionMap.value[item.menuCode] || []
    if (permissionMap.value[item.menuCode]) {
      rowSelection.value.selectedRowKeys.push(item.id)
    }
    return {
      ...item,
      operation: operations,
      children: item.children ? mapOperations(item.children) : undefined,
    }
  })
}

const mapChecked = (data, checked) => {
  return data.forEach((item) => {
    item.operationChecked = checked ? item.operation : []

    if (item.children) {
      mapChecked(item.children, checked)
    }
  })
}

const mapAllChecked = (data, checked) => {
  return data.forEach((item) => {
    item.operationChecked = checked ? item.operation : []
    if (!rowSelection.value.selectedRowKeys.includes(item.id)) {
      rowSelection.value.selectedRowKeys.push(item.id)
    }
    if (item.children) {
      mapAllChecked(item.children, checked)
    }
  })
}

const handleOperationChange = (record, op, checked) => {
  console.log('handleOperationChange', record, op, checked)
  if (checked) {
    record.operationChecked.push(op)
  } else {
    record.operationChecked = record.operationChecked.filter((oc) => oc !== op)
  }
}
const handleOperationChecked = (record) => {
  record.operationChecked = record.operation
  if (!rowSelection.value.selectedRowKeys.includes(record.id)) {
    rowSelection.value.selectedRowKeys.push(record.id)
  }
}

const handleAllChecked = (record) => {
  mapAllChecked([record], true)
}

const collectSelectedPermissions = (data, initial = {}) => {
  return data.reduce((acc, cur) => {
    const selectedRowKeys = rowSelection.value.selectedRowKeys
    if (selectedRowKeys.includes(cur.id)) {
      acc[cur.menuCode] = cur.operationChecked
    }
    if (cur.children && cur.children.length) {
      collectSelectedPermissions(cur.children, acc)
    }
    return acc
  }, initial)
}

const queryPermission = async () => {
  if (tree.data.length) {
    return
  }
  try {
    const res = await queryTreeApi()
    console.log('*********************', res)

    rowSelection.value.selectedRowKeys = []
    tableData.value = mapOperations(res.data)
    console.log(tableData.value)
    tableKey.value = tableKey.value + 1 // 刷新表格
  } catch (error) {
    console.log(error)
  }
}
</script>
