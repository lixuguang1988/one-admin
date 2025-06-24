import request from '@/utils/request'

export const addOneApi = (data) => {
  return request({
    url: '/news/add',
    method: 'post',
    data,
  })
}

export const updateOneApi = (data) => {
  return request({
    url: '/news/update',
    method: 'post',
    data,
  })
}

export const queryListApi = (params) => {
  return request({
    url: '/news/list',
    method: 'get',
    params,
  })
}

export const queryOneApi = (id) => {
  return request({
    url: `/news/${id}`,
    method: 'get',
  })
}
export const deleteOneApi = (id) => {
  return request({
    url: `/news/${id}`,
    method: 'delete',
  })
}

export const batchDeleteApi = (id) => {
  return request({
    url: `/news/${id}`,
    method: 'delete',
  })
}
