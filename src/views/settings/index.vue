<template>
  <div class="settings">
    <van-nav-bar title="设置" />
    <div class="content">
      <!-- 待实现 -->
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Settings',
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/_variables' as *;

.settings {
  min-height: 100vh;
  background-color: $color-background;

  .content {
    padding: 16px;
  }
}
</style> 