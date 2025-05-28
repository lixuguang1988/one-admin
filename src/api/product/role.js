import request from '@/utils/request'

export const addOneApi = (data) => {
  return request({
    url: '/role/add',
    method: 'post',
    data,
  })
}

export const updateOneApi = (data) => {
  return request({
    url: '/role/update',
    method: 'post',
    data,
  })
}

export const queryListApi = (params) => {
  return request({
    url: '/role/list',
    method: 'get',
    params,
  })
}

export const deleteOneApi = (id) => {
  return request({
    url: `/role/${id}`,
    method: 'delete',
  })
}

export const queryRoleListApi = (params) => {
  return request({
    url: `/role/user`,
    method: 'get',
    params,
  })
}

export const addRoleOneApi = (data) => {
  return request({
    url: `/role/user`,
    method: 'post',
    data,
  })
}

export const deleteRoleOneApi = (data) => {
  return request({
    url: `/role/user`,
    method: 'delete',
    data: data,
  })
}
