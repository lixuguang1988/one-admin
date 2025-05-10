import request from '@/utils/request'

export const queryPermissionApi = (params = {}) => {
  return request({
    url: '/user/permission',
    method: 'get',
    params,
  })
}
