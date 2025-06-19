<template>
  <div class="settings-page">
    <van-nav-bar title="设置" fixed :placeholder="true" />
    
    <!-- 复习间隔设置 -->
    <div class="settings-section">
      <div class="section-title">复习间隔设置</div>
      <div class="section-content">
        <van-cell-group inset>
          <van-cell title="复习间隔规则" is-link to="/settings/interval" />
        </van-cell-group>
      </div>
    </div>

    <!-- 账号设置 -->
    <div class="settings-section">
      <div class="section-title">账号设置</div>
      <div class="section-content">
        <van-cell-group inset>
          <van-cell title="退出登录" is-link @click="handleLogout">
            <template #right-icon>
              <van-icon name="sign-out" class="logout-icon" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { showDialog } from 'vant'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  showDialog({
    title: '退出登录',
    message: '确定要退出登录吗？',
    showCancelButton: true,
  }).then(() => {
    // 清除登录状态
    userStore.logout()
    // 跳转到登录页
    router.replace('/login/wechat')
  }).catch(() => {
    // 取消退出
  })
}
</script>

<style lang="scss" scoped>
.settings-page {
  flex: 1;
  min-height: 0;
  box-sizing: border-box;
  padding: 16px;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.settings-section {
  margin-bottom: 24px;

  .section-title {
    font-size: 14px;
    color: #969799;
    padding: 16px 16px 8px;
  }

  .section-content {
    .logout-icon {
      color: #ee0a24;
    }
  }
}
</style> 