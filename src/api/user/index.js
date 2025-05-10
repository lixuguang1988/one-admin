import request from '@/utils/request'

export const loginApi = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export const addUserApi = (data) => {
  return request({
    url: '/user/add',
    method: 'post',
    data,
  })
}

export const updateUserApi = (data) => {
  return request({
    url: '/user/update',
    method: 'post',
    data,
  })
}

export const queryUserListApi = (params) => {
  return request({
    url: '/user/list',
    method: 'get',
    params,
  })
}

export const deleteUserApi = (id) => {
  return request({
    url: `/user/${id}`,
    method: 'delete',
  })
}

export const batchDeleteUserApi = (data) => {
  return request({
    url: `/user/batch`,
    method: 'delete',
    data: data,
  })
}
