import axios from 'axios'
import { message } from 'ant-design-vue'
import { getToken, clearToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: import.meta.env.VITE_TIME_OUT, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    const token = getToken()
    if (token) {
      // let each request carry token
      // ['Authorization'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = token
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      //   warning(res.message || 'Error')

      // 408: Illegal token; 412: Other clients logged in; 414: Token expired;
      if (res.code === 408 || res.code === 412 || res.code === 414 || res.code === 401) {
        message.config({ maxCount: 1 }) // 配置最多显示一个提示
        // to re-login
        setTimeout(() => {
          message.warning(`请重新登录-${res.message}`, 1, () => {
            clearToken()
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        }, 0)
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    message.warning(error.message)
    return Promise.reject(error)
  },
)

console.log(import.meta.env, import.meta.env.VITE_BASE_API, 'VUE_BASE_API')

export default service
