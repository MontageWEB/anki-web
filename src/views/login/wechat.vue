<template>
  <div class="login-bg">
    <div class="login-iphone-frame">
      <div class="login-iphone-notch"></div>
      <div class="login-iphone-screen">
        <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=96&h=96&facepad=2" alt="logo" class="login-logo" />
        <div class="login-title">欢迎使用 Anki复习助手</div>
        <div class="login-desc">高效记忆，轻松复习</div>
        <button
          class="login-btn"
          :disabled="loading"
          @click="handleWxLogin"
        >
          <i class="fab fa-weixin"></i>
          微信一键登录
        </button>
        <div v-if="loading" class="login-loading">
          <i class="fas fa-spinner fa-spin"></i>
          登录中...
        </div>
        <div v-if="error" class="login-error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const error = ref('')

const handleWxLogin = async () => {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    const code = import.meta.env.MODE === 'development' ? 'test-code' : await getWeixinCode()
    if (!code) {
      error.value = '获取微信授权失败'
      return
    }
    const success = await userStore.loginWithWechat(code)
    if (success) {
      router.replace('/')
    } else {
      error.value = '登录失败，请重试'
    }
  } catch (e) {
    error.value = '登录失败，请重试'
  } finally {
    loading.value = false
  }
}

function getWeixinCode() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve('mock-wx-code')
      } else {
        reject(new Error('获取微信授权失败'))
      }
    }, 500)
  })
}
</script>

<style>
.login-bg {
  min-height: 100vh;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-iphone-frame {
  width: 375px;
  height: 812px;
  background: #fff;
  border-radius: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-iphone-notch {
  width: 150px;
  height: 30px;
  background: #000;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  z-index: 10;
}
.login-iphone-screen {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  padding: 80px 24px 24px;
  box-sizing: border-box;
  overflow-y: auto;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  object-fit: cover;
}
.login-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #222;
  text-align: center;
}
.login-desc {
  font-size: 16px;
  color: #888;
  margin-bottom: 32px;
  text-align: center;
}
.login-btn {
  width: 100%;
  padding: 14px 0;
  border: none;
  border-radius: 12px;
  background: #1aad19;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(26,173,25,0.08);
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 18px;
}
.login-btn:disabled {
  background: #b2e5b2;
  cursor: not-allowed;
}
.login-btn i {
  font-size: 22px;
}
.login-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1aad19;
  font-size: 16px;
  margin-bottom: 8px;
}
.login-error {
  color: #f5222d;
  font-size: 16px;
  margin-top: 8px;
  text-align: center;
}
@media (max-width: 500px) {
  .login-iphone-frame {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
  .login-iphone-notch {
    display: none;
  }
  .login-iphone-screen {
    border-radius: 0;
    padding: 48px 8px 8px;
  }
}
</style>
