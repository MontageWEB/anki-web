import { defineStore } from 'pinia'
import { ref } from 'vue'
import { wxLogin } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)

  // 设置 token
  function setToken(newToken) {
    if (!newToken) {
      console.error('Token 不能为空')
      return false
    }
    token.value = newToken
    localStorage.setItem('token', newToken)
    return true
  }

  // 清除 token
  function clearToken() {
    token.value = ''
    localStorage.removeItem('token')
  }

  // 微信登录
  async function loginWithWechat(code, nickname = '', avatar = '') {
    try {
      if (!code) {
        console.error('微信 code 不能为空')
        return false
      }

      const { access_token } = await wxLogin({ code, nickname, avatar })
      if (!access_token) {
        console.error('登录失败：未获取到 token')
        return false
      }

      const success = setToken(access_token)
      if (!success) {
        console.error('登录失败：token 设置失败')
        return false
      }

      return true
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  // 退出登录
  function logout() {
    clearToken()
    userInfo.value = null
  }

  return {
    token,
    userInfo,
    setToken,
    clearToken,
    loginWithWechat,
    logout
  }
}) 