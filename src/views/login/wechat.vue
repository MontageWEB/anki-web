<template>
  <div class="login-page">
    <van-nav-bar title="微信登录" />
    <div class="login-content">
      <van-button type="primary" block :loading="loading" @click="handleWxLogin">
        微信一键登录
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const handleWxLogin = async () => {
  if (loading.value) return
  loading.value = true
  
  try {
    // 开发环境用测试账号
    const code = import.meta.env.MODE === 'development' ? 'test-code' : await getWeixinCode()
    
    if (!code) {
      showToast('获取微信授权失败')
      return
    }

    const success = await userStore.loginWithWechat(code)
    if (success) {
      showToast('登录成功')
      router.replace('/')
    } else {
      showToast('登录失败，请重试')
    }
  } catch (e) {
    console.error('登录错误:', e)
    showToast('登录失败，请重试')
  } finally {
    loading.value = false
  }
}

// 伪代码：实际需用微信 JS-SDK
function getWeixinCode() {
  return new Promise((resolve, reject) => {
    // 微信环境下用 wx.login
    // 这里直接模拟
    setTimeout(() => {
      // 模拟 50% 概率失败
      if (Math.random() > 0.5) {
        resolve('mock-wx-code')
      } else {
        reject(new Error('获取微信授权失败'))
      }
    }, 500)
  })
}
</script>

<style scoped>
.login-content {
  margin: 40px 16px;
}
</style>
