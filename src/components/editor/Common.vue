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
  content: 'test',
})

const defaultValue = `
<h2 style="text-align: center;">
  TinyMCE provides a <span style="text-decoration: underline;">full-featured</span> rich text editing experience, and a featherweight download.
</h2>
<p style="text-align: center;">
  <strong><span style="font-size: 14pt;"><span style="color: #7e8c8d; font-weight: 600;">No matter what you're building, TinyMCE has got you covered.</span></span></strong>
</p>`

const emits = defineEmits(['update:content'])
const content = ref(props.content || defaultValue)
const editorRef = ref(null)

const editorConfig = {
  height: 500,
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
  toolbar:
    'undo redo | casechange blocks | bold italic backcolor forecolor | image | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlst checklist outdent indent | removeformat | a11ycheck code table help',
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
