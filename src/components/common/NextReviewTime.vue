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
    :default-date="calendarDefaultDate"
    :formatter="calendarFormatter"
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
  if (!props.card.nextReviewTime) {
    return '未设置'
  }
  
  try {
    // 处理日期字符串，移除可能存在的 +00:00Z 后缀
    const dateStr = props.card.nextReviewTime.replace('+00:00Z', 'Z')
    const date = new Date(dateStr)
    
    if (isNaN(date.getTime())) {
      return '日期无效'
    }
    
    // 使用 Intl.DateTimeFormat 来格式化日期，这样可以正确处理时区
    const formatter = new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Shanghai'
    })
    
    return formatter.format(date)
  } catch (error) {
    console.error('日期格式化错误:', error)
    return '日期无效'
  }
})

// 日历默认选中日期（卡片的下次复习时间）
const calendarDefaultDate = computed(() => {
  if (!props.card.nextReviewTime) {
    return new Date()
  }
  
  try {
    // 处理日期字符串，移除可能存在的 +00:00Z 后缀
    const dateStr = props.card.nextReviewTime.replace('+00:00Z', 'Z')
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? new Date() : date
  } catch (error) {
    console.error('日期转换错误:', error)
    return new Date()
  }
})

// 日历自定义样式：高亮今天和当前选中日期
const calendarFormatter = (day) => {
  const today = new Date()
  const isToday =
    day.date.getFullYear() === today.getFullYear() &&
    day.date.getMonth() === today.getMonth() &&
    day.date.getDate() === today.getDate()
  const isSelected =
    props.card.nextReviewTime &&
    day.date.getFullYear() === new Date(props.card.nextReviewTime).getFullYear() &&
    day.date.getMonth() === new Date(props.card.nextReviewTime).getMonth() &&
    day.date.getDate() === new Date(props.card.nextReviewTime).getDate()

  if (isToday && isSelected) {
    day.topInfo = '今天'
    day.className = 'calendar-today-selected'
  } else if (isToday) {
    day.topInfo = '今天'
    day.className = 'calendar-today'
  } else if (isSelected) {
    day.className = 'calendar-selected'
  }
  return day
}

// 处理点击事件
const handleClick = (event) => {
  event.preventDefault() // 阻止默认行为
  event.stopPropagation() // 阻止事件冒泡
  showCalendar.value = true
}

// 处理日期确认
const handleDateConfirm = async (date) => {
  try {
    // 将日期设置为当天的 23:59:59
    const nextReviewAt = new Date(date)
    nextReviewAt.setHours(23, 59, 59, 999)
    
    // 使用新的 API 更新下次复习时间
    await cardStore.updateNextReviewTime(props.card.id, nextReviewAt.toISOString())
    
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

:deep(.calendar-today) {
  background: #e6f7ff !important;
  color: #1890ff !important;
  border-radius: 50%;
}
:deep(.calendar-selected) {
  background: #1989fa !important;
  color: #fff !important;
  border-radius: 50%;
}
:deep(.calendar-today-selected) {
  background: linear-gradient(135deg, #1989fa 60%, #e6f7ff 100%) !important;
  color: #fff !important;
  border-radius: 50%;
}
</style> 