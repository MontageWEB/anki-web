import axios from 'axios'
import { showToast } from 'vant'
import { API_BASE_URL, REQUEST_TIMEOUT } from '@/config'

// 创建 axios 实例
const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 这里可以根据后端的响应结构进行调整
    if (res.code && res.code !== 200) {
      showToast({
        type: 'fail',
        message: res.message || '请求失败'
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res.data || res
  },
  error => {
    console.error('响应错误:', error)
    showToast({
      type: 'fail',
      message: error.message || '网络错误'
    })
    return Promise.reject(error)
  }
)

export default service 