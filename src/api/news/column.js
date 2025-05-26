import request from '@/utils/request'

const Cache = {}

export const addOneApi = (data) => {
  return request({
    url: '/column/add',
    method: 'post',
    data,
  })
}

export const updateOneApi = (data) => {
  return request({
    url: '/column/update',
    method: 'post',
    data,
  })
}

export const queryListApi = (params) => {
  return request({
    url: '/column/list',
    method: 'get',
    params,
  })
}

export const queryTreeApi = (parentId, fromCache) => {
  const key = `column_${parentId || 'root'}`
  if (Cache[key] && fromCache) {
    return Promise.resolve(Cache[key])
  }
  return request({
    url: `/column/hierarchy`,
    method: 'get',
    params: { parentId },
  }).then((res) => {
    Cache[key] = res
    return res
  })
}

export const deleteOneApi = (id) => {
  return request({
    url: `/column/${id}`,
    method: 'delete',
  })
}

export const queryRoleListApi = (params) => {
  return request({
    url: `/column/user`,
    method: 'get',
    params,
  })
}

export const addRoleOneApi = (data) => {
  return request({
    url: `/column/user`,
    method: 'post',
    data,
  })
}

export const deleteRoleOneApi = (data) => {
  return request({
    url: `/column/user`,
    method: 'delete',
    data: data,
  })
}
