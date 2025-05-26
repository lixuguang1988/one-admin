import request from '@/utils/request'
import axios from 'axios'
import { getToken, clearToken } from '@/utils/auth'

export const uploadURI = import.meta.env.VITE_BASE_API + '/common/upload'

export const queryPermissionApi = (params = {}) => {
  return request({
    url: '/user/permission',
    method: 'get',
    params,
  })
}
