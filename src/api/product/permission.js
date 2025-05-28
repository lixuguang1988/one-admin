import request from '@/utils/request'

export const addPermissioApi = (data) => {
  return request({
    url: '/permission/add',
    method: 'post',
    data,
  })
}

export const updatePermissionApi = (data) => {
  return request({
    url: '/permission/update',
    method: 'post',
    data,
  })
}

export const queryPermissionListApi = (params) => {
  return request({
    url: '/permission/list',
    method: 'get',
    params,
  })
}

export const deletePermissionApi = (id) => {
  return request({
    url: `/permission/${id}`,
    method: 'delete',
  })
}

export const queryTreeApi = (id) => {
  return request({
    url: `/permission/hierarchy`,
    method: 'get',
  })
}
