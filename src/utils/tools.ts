import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
export function resizeColumn(w: number, col: TableColumnsType[number]) {
  col.width = w
}

export const rules = {
  phone: /^1[3-9]\d{9}$/,
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
}

export const prioritys = Array.from({ length: 11 }, (_, index) => (index + 1) * 10)

export const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

export const getBase64 = (img: Blob, callback: Function) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
