<template>
  <div class="card-add">
    <van-nav-bar
      title="新增卡片"
      left-arrow
      right-text="保存"
      @click-left="handleBack"
      @click-right="handleSave"
    />
    <div class="content">
      <!-- 待实现 -->
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'CardAdd',
  setup() {
    const router = useRouter()

    const handleBack = () => {
      router.back()
    }

    const handleSave = () => {
      // 待实现
    }

    return {
      handleBack,
      handleSave
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/_variables' as *;

.card-add {
  min-height: 100vh;
  background-color: $background-color;

  .content {
    padding: $spacing-medium;
  }
}
</style> 