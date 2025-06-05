import request from '@/utils/request'

export const addOneApi = (data) => {
  return request({
    url: '/pet/add',
    method: 'post',
    data,
  })
}

export const updateOneApi = (data) => {
  return request({
    url: '/pet/update',
    method: 'post',
    data,
  })
}

export const queryListApi = (params) => {
  return request({
    url: '/pet/list',
    method: 'get',
    params,
  })
}

export const queryOneApi = (id) => {
  return request({
    url: `/pet/${id}`,
    method: 'get',
  })
}

export const deleteOneApi = (id) => {
  return request({
    url: `/pet/${id}`,
    method: 'delete',
  })
}

export const batchDeleteApi = (id) => {
  return request({
    url: `/pet/${id}`,
    method: 'delete',
  })
}
