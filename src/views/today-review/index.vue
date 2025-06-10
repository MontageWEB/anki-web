<template>
  <div class="today-review">
    <van-nav-bar
      title="今日复习"
      right-text="新增"
      @click-right="handleAdd"
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
  name: 'TodayReview',
  setup() {
    const router = useRouter()

    const handleAdd = () => {
      router.push({
        path: '/card/add',
        query: { from: 'list' }
      })
    }

    return {
      handleAdd
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/_variables' as *;

.today-review {
  min-height: 100vh;
  background-color: $background-color;

  .content {
    padding: $spacing-medium;
  }
}
</style> 