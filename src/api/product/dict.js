import request from '@/utils/request'

const Cache = {}

export const addOneApi = (data) => {
  return request({
    url: '/dict/add',
    method: 'post',
    data,
  })
}

export const updateOneApi = (data) => {
  return request({
    url: '/dict/update',
    method: 'post',
    data,
  })
}

export const queryListApi = (params) => {
  return request({
    url: '/dict/list',
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
    url: `/dict/hierarchy`,
    method: 'get',
    params: { parentId },
  }).then((res) => {
    Cache[key] = res
    return res
  })
}

export const deleteOneApi = (id) => {
  return request({
    url: `/dict/${id}`,
    method: 'delete',
  })
}

export const queryRoleListApi = (params) => {
  return request({
    url: `/dict/user`,
    method: 'get',
    params,
  })
}

export const addRoleOneApi = (data) => {
  return request({
    url: `/dict/user`,
    method: 'post',
    data,
  })
}

export const deleteRoleOneApi = (data) => {
  return request({
    url: `/dict/user`,
    method: 'delete',
    data: data,
  })
}
