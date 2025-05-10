import { computed, ref, reactive, watch } from 'vue'
import { Grid } from 'ant-design-vue'

const useFormFields = () => {
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  const collapsed = ref(true)
  const showFields = ref(screens.value.xxl ? 3 : 2)

  // 是否是宽屏
  const isWide = computed(() => {
    return screens.value.xxl
  })

  const span = computed(() => {
    return isWide.value ? 6 : 8
  })

  const defaultShowFields = computed(() => {
    return isWide.value ? 3 : 2
  })

  const layout = computed(() => {
    return !screens.value.md ? 'vertical' : 'horizontal'
  })

  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value
    showFields.value = collapsed.value ? defaultShowFields.value : 99
  }

  // watch(
  //   () => screens.value,
  //   (val) => {
  //     console.log(
  //       'vscreensscreensscreensscreensscreensscreensscreensscreensscreensscreensal',
  //       val,
  //       isWide.value,
  //     )
  //   },
  //   { immediate: true },
  // )

  return {
    span, // 一块几个宽度
    toggleCollapsed,
    showFields,
    defaultShowFields,
    layout,
    gutter: [16, 24],
    isWide,
  }
}

export default useFormFields
