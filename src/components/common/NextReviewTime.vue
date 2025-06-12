<template>
  <div class="next-review-time" @click.stop="handleClick">
    <van-icon name="calendar-o" />
    <span class="time-text">下次复习：{{ formattedDate }}</span>
  </div>

  <!-- 日期选择器弹窗 -->
  <van-calendar
    v-model:show="showCalendar"
    @confirm="handleDateConfirm"
    :min-date="minDate"
    color="#1989fa"
    title="选择下次复习时间"
    round
    show-confirm
    confirm-text="确定"
    confirm-disabled-text="确定"
    teleport="body"
    position="bottom"
    :close-on-click-overlay="true"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { showSuccessToast, showToast } from 'vant'
import { useCardStore } from '@/store/card'

const cardStore = useCardStore()

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update'])

// 日期选择器控制
const showCalendar = ref(false)

// 设置最小日期为 2020-01-01（一个足够早的日期）
const minDate = new Date(2020, 0, 1)

// 格式化日期
const formattedDate = computed(() => {
  const date = new Date(props.card.nextReviewTime)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
})

// 处理点击事件
const handleClick = (event) => {
  event.preventDefault() // 阻止默认行为
  event.stopPropagation() // 阻止事件冒泡
  showCalendar.value = true
}

// 处理日期确认
const handleDateConfirm = async (date) => {
  try {
    // 使用新的 API 更新下次复习时间
    await cardStore.updateNextReviewTime(props.card.id, date.toISOString())
    
    showCalendar.value = false
    showSuccessToast('下次复习时间已更新')
    
    // 通知父组件更新数据
    emit('update')
  } catch (error) {
    console.error('更新复习时间失败:', error)
    showToast({
      type: 'fail',
      message: '更新失败'
    })
  }
}
</script>

<style lang="scss" scoped>
.next-review-time {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: #1989fa;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  .van-icon {
    margin-right: 4px;
    font-size: 16px;
  }
  
  .time-text {
    border-bottom: 1px dashed currentColor;
    padding-bottom: 1px;
  }
  
  &:hover {
    background-color: rgba(25, 137, 250, 0.1);
  }
}

:deep(.van-calendar) {
  z-index: 2000;
}

:deep(.van-popup) {
  z-index: 2000;
}
</style> 