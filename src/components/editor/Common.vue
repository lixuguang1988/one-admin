<template>
  <div>
    <Editor
      licenseKey="gpl"
      ref="editorRef"
      api-key="n1ijf0gxuhv36po4pu2t2cs7qvsenrzgajtjq2q3tgdu7xom"
      v-model="content"
      :init="editorConfig"
      :initial-value2="content"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Editor from '@tinymce/tinymce-vue'

const props = defineProps({
  content: {
    type: String,
  },
  type: {
    type: String,
    default: 'standard',
  },
  height: {
    type: Number,
  },
})

const defaultValue = ``

const emits = defineEmits(['update:content'])
const content = ref(props.content || defaultValue)
const editorRef = ref(null)

const toolbar =
  props.type === 'standard'
    ? 'undo redo | casechange blocks | bold italic backcolor forecolor | image | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlst checklist outdent indent | removeformat | a11ycheck code table help'
    : 'bold italic backcolor forecolor | \
    alignleft aligncenter alignright alignjustify '
const defaultHeight = props.type === 'standard' ? 500 : 200
const editorConfig = {
  height: defaultHeight || props.height,
  menubar: false,
  language: 'zh_CN',
  plugins: [
    // 'a11ychecker',
    'advlist',
    // 'advcode',
    'advtable',
    'autolink',
    // 'checklist',
    'export',
    'lists',
    'link',
    'image',
    'charmap',
    'preview',
    'anchor',
    'searchreplace',
    'visualblocks',
    // 'powerpaste',
    'fullscreen',
    // 'formatpainter',
    'insertdatetime',
    'media',
    'table',
    'help',
    'wordcount',
  ],
  toolbar: toolbar,
}
watch(
  () => props.content,
  (val) => {
    // nextTick(() => {
    //   // tinymce.get('editor').setContent(val)
    // })
    if (val !== content.value) {
      content.value = val
    }
  },
)

watch(
  () => content.value,
  (val) => {
    emits('update:content', val)
  },
)

const handleChange = (evet) => {
  console.log(evet)
}
</script>
