import dayjs from 'dayjs'

export const formatDatetime = (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss')

export const formatDate = (date: string) => dayjs(date).format('YYYY-MM-DD')
