<template>
  <div class="custom-column">
    <a-tooltip title="列设置">
      <a-dropdown v-model:open="visible" trigger="custom" placement="bottomRight">
        <SettingOutlined @click="visible = !visible" />
        <template #overlay>
          <a-card style="min-width: 240px" ref="cardRef">
            <template #title>
              <a-checkbox
                v-model:checked="checkAll"
                :indeterminate="indeterminate"
                @change="onCheckAllChange"
              >
                全选
              </a-checkbox>
            </template>
            <template #extra>
              <a-button type="link" @click="handleReset">重置</a-button>
            </template>
            <VueDraggable ref="el" v-model="list" @end="onEnd">
              <div v-for="item in list" :style="{ lineHeight: '26px' }" :key="item.key">
                <a-space size="middle">
                  <HolderOutlined class="generic-pointer" />
                  <a-checkbox
                    v-model:checked="columnChecked[item.key]"
                    @change="(event) => handleChange(item, event)"
                  ></a-checkbox>
                  <span>{{ item.title.trim() || item._title }}</span>
                </a-space>
              </div>
            </VueDraggable>
          </a-card>
        </template>
      </a-dropdown>
    </a-tooltip>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch, computed } from 'vue'
import { HolderOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { onClickOutside } from '@vueuse/core'
import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps({
  columns: {
    type: Object,
    default: () => [],
  },
})

const emit = defineEmits(['update:columns'])

const cardRef = ref(null)
const list = ref([])
const columnChecked = ref({})
const visible = ref(false)

onClickOutside(cardRef, (event) => {
  console.log(event, '-------------')
  visible.value = false
})

watch(
  () => props.columns,
  (val) => {
    if (val) {
      list.value = [...props.columns]
      columnChecked.value = list.value.reduce((acc, cur) => {
        acc[cur.key] = cur.checked !== false // checked 是undefined 或者是true
        return acc
      }, {})
    } else {
      list.value = []
      columnChecked.value = {}
    }
  },
  {
    immediate: true,
  },
)

const onEnd = () => {
  console.log(list.value)
  emit('update:columns', list.value)
}

const handleChange = (item, event) => {
  const checked = event.target.checked
  columnChecked.value[item.key] = checked
  list.value = list.value.map((column) => {
    if (column.key === item.key) {
      column.checked = checked
    }
    return column
  })
  emit('update:columns', list.value)
}

const checkAll = computed(() => {
  return !list.value.some((item) => {
    return item.checked === false // 选中状态是可能指undefined或者true
  })
})

const indeterminate = computed(() => {
  const checkedCount = list.value.filter((item) => {
    return item.checked !== false
  }).length
  return checkedCount > 0 && checkedCount < list.value.length
})

const onCheckAllChange = (event) => {
  const checked = event.target.checked
  list.value.forEach((item) => {
    item.checked = checked
    columnChecked.value[item.key] = checked
  })
  emit('update:columns', list.value)
}

const handleReset = () => {
  list.value.forEach((item) => {
    item.checked = true
    columnChecked.value[item.key] = true
  })
  emit('update:columns', list.value)
}
</script>
