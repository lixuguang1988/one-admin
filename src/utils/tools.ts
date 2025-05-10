import type { TableColumnsType } from 'ant-design-vue'
export function resizeColumn(w: number, col: TableColumnsType[number]) {
  col.width = w
}

export const rules = {
  phone: /^1[3-9]\d{9}$/,
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
}
