<template>
  <a-modal :open="visible" title="图片预览" :footer="null" @cancel="handleClosePreview">
    <a-flex justify="center" style="margin-bottom: 16px">
      <img alt="example" style="max-width: 100%" :src="previewImage" />
    </a-flex>
    <a-flex justify="space-between" style="margin-top: 16px">
      <span>
        <LeftOutlined v-if="showPrev" size="large" @click="handlePrev" />
      </span>
      <span>
        <RightOutlined v-if="showNext" size="large" @click="handleNext" />
      </span>
    </a-flex>
  </a-modal>
</template>

<script setup>
import { computed, onMounted, reactive, ref, toRaw, watch } from 'vue'
import { RightOutlined, LeftOutlined } from '@ant-design/icons-vue'
import { getBase64 } from '@/utils/tools'

const props = defineProps({
  fileList: {
    type: Array,
    default: [],
  },
  index: {
    type: Number,
    default: 0,
  },
  visible: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:visible', 'onSuccess'])

const previewImage = ref('')
const previewIndex = ref(props.index)
watch(
  () => props.visible,
  (value) => {
    if (value) {
      previewIndex.value = toRaw(props.index)
      updatePreview()
    }
  },
  {
    immediate: true,
  },
)

const showNext = computed(() => {
  return previewIndex.value < props.fileList.length - 1
})

const showPrev = computed(() => {
  return previewIndex.value > 0
})

const handlePrev = (event) => {
  event.preventDefault()
  if (previewIndex.value > 0) {
    previewIndex.value -= 1
    updatePreview()
  }
}
const handleNext = (event) => {
  event.preventDefault()
  if (previewIndex.value < props.fileList.length - 1) {
    previewIndex.value += 1
    updatePreview()
  }
}

const updatePreview = async () => {
  const file = toRaw(props.fileList[previewIndex.value])
  if (!file.url && !file.preview && file.originFileObj) {
    file.preview = await getBase64(file.originFileObj)
  }
  previewImage.value = file.url || file.preview
}

const handleClosePreview = () => {
  emit('update:visible', false)
}
</script>
