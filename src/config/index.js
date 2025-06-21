/**
 * 项目配置文件
 */

// 当前环境
const ENV = import.meta.env.MODE

// 不同环境的 API 地址配置
const API_CONFIG = {
  development: '/api',
  test: 'http://test-api.example.com',
  production: 'http://api.example.com'
}

// API 基础地址
export const API_BASE_URL = API_CONFIG[ENV] || API_CONFIG.development

// 请求超时时间（毫秒）
export const REQUEST_TIMEOUT = 15000

// 其他配置项... 