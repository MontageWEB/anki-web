<template>
  <div class="today-review">
    <!-- 导航栏 -->
    <van-nav-bar
      title="今日复习"
      fixed
      :border="false"
      :placeholder="true"
      class="custom-nav"
    >
      <template #right>
        <van-icon name="plus" size="24" @click="handleAdd" />
      </template>
    </van-nav-bar>

    <!-- 复习卡片区域 -->
    <div v-if="todayCards.length > 0" class="card-container">
      <van-swipe
        :loop="false"
        :show-indicators="false"
        @change="handleCardChange"
      >
        <van-swipe-item v-for="card in todayCards" :key="card.id">
          <div class="review-card" :class="{ 'is-flipped': card.isFlipped }">
            <!-- 卡片正面 -->
            <div class="card-face card-front" @click="handleFlip(card)">
              <div class="card-content">
                <span class="card-label">知识点</span>
                <div class="card-text-wrapper">
                  <p class="card-text">{{ card.title }}</p>
                </div>
              </div>
              <div class="card-footer">
                <div class="card-info">
                  <div class="info-item">
                    <van-icon name="clock-o" />
                    <span>复习次数：{{ card.reviewCount }}</span>
                  </div>
                  <div class="info-item">
                    <van-icon name="calendar-o" />
                    <span>下次复习：{{ formatDate(card.nextReviewTime) }}</span>
                  </div>
                </div>
                <div class="card-actions">
                  <van-button 
                    type="success" 
                    size="small"
                    class="action-btn success-btn" 
                    @click.stop="handleMastered(card)"
                  >
                    <template #icon>
                      <van-icon name="checked" />
                    </template>
                    掌握
                  </van-button>
                  <van-button 
                    type="danger" 
                    size="small"
                    class="action-btn danger-btn" 
                    @click.stop="handleForgotten(card)"
                  >
                    <template #icon>
                      <van-icon name="cross" />
                    </template>
                    忘记
                  </van-button>
                </div>
              </div>
            </div>
            <!-- 卡片反面 -->
            <div class="card-face card-back" @click="handleFlip(card)">
              <div class="card-content">
                <span class="card-label">答案</span>
                <div class="card-text-wrapper">
                  <p class="card-text">{{ card.answer }}</p>
                </div>
              </div>
              <div class="card-footer">
                <div class="card-info">
                  <div class="info-item">
                    <van-icon name="clock-o" />
                    <span>复习次数：{{ card.reviewCount }}</span>
                  </div>
                  <div class="info-item">
                    <van-icon name="calendar-o" />
                    <span>下次复习：{{ formatDate(card.nextReviewTime) }}</span>
                  </div>
                </div>
                <div class="card-actions">
                  <van-button 
                    type="success" 
                    size="small"
                    class="action-btn success-btn" 
                    @click.stop="handleMastered(card)"
                  >
                    <template #icon>
                      <van-icon name="checked" />
                    </template>
                    掌握
                  </van-button>
                  <van-button 
                    type="danger" 
                    size="small"
                    class="action-btn danger-btn" 
                    @click.stop="handleForgotten(card)"
                  >
                    <template #icon>
                      <van-icon name="cross" />
                    </template>
                    忘记
                  </van-button>
                </div>
              </div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>

      <!-- 进度指示器 -->
      <div class="progress-indicator">
        <span class="current">{{ currentIndex + 1 }}</span>
        <span class="separator">/</span>
        <span class="total">{{ todayCards.length }}</span>
      </div>
    </div>

    <!-- 无卡片提示 -->
    <van-empty
      v-else
      class="custom-empty"
      description="今天没有需要复习的卡片"
    >
      <template #image>
        <van-icon name="smile-o" size="64" color="#8696a7" />
      </template>
    </van-empty>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import storage from '@/utils/storage'

const router = useRouter()
const todayCards = ref([])
const currentIndex = ref(0)

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 获取今日需要复习的卡片
const fetchTodayCards = async () => {
  const allCards = await storage.getAllCards()
  const today = new Date()
  today.setHours(23, 59, 59, 999)  // 设置为今天的 23:59:59.999
  
  todayCards.value = allCards
    .filter(card => new Date(card.nextReviewTime) <= today)
    .map(card => ({
      ...card,
      isFlipped: false
    }))
}

// 计算下次复习时间
const calculateNextReviewTime = (reviewCount) => {
  const today = new Date()
  let days = 1

  if (reviewCount <= 3) days = 1
  else if (reviewCount === 4) days = 2
  else if (reviewCount === 5) days = 3
  else if (reviewCount === 6) days = 5
  else if (reviewCount <= 8) days = 7
  else if (reviewCount <= 10) days = 14
  else if (reviewCount <= 12) days = 30
  else days = 60

  return new Date(today.setDate(today.getDate() + days))
}

// 处理卡片翻转
const handleFlip = (card) => {
  card.isFlipped = !card.isFlipped
}

// 处理卡片切换
const handleCardChange = (index) => {
  currentIndex.value = index
  // 确保新卡片显示正面
  if (todayCards.value[index]) {
    todayCards.value[index].isFlipped = false
  }
}

// 处理掌握按钮点击
const handleMastered = async (card) => {
  const nextReviewTime = calculateNextReviewTime(card.reviewCount + 1)
  await storage.updateReviewRecord(card.id, nextReviewTime)
  showSuccessToast('已掌握，下次复习时间已更新')
  await fetchTodayCards()
}

// 处理忘记按钮点击
const handleForgotten = async (card) => {
  const nextReviewTime = new Date() // 立即复习
  await storage.updateCard(card.id, {
    reviewCount: 0,
    nextReviewTime: nextReviewTime.toISOString()
  })
  showSuccessToast('已重置，需要重新开始复习')
  await fetchTodayCards()
}

// 跳转到新增卡片页面
const handleAdd = () => {
  router.push({
    path: '/card/add',
    query: { from: 'today-review' }
  })
}

onMounted(() => {
  fetchTodayCards()
})
</script>

<style lang="scss" scoped>
@use '@/styles/_variables' as *;

.today-review {
  min-height: 100vh;
  background-color: #f7f9fc;
  padding: $spacing-medium;
  
  .custom-nav {
    background-color: transparent;
    
    :deep(.van-nav-bar__title) {
      color: #2c3e50;
      font-weight: 600;
    }
    
    :deep(.van-icon) {
      color: #2c3e50;
    }
  }
}

.card-container {
  margin-top: calc($spacing-large * 2);
  height: calc(100vh - 180px);
  position: relative;
  
  :deep(.van-swipe) {
    height: 100%;
  }
  
  :deep(.van-swipe-item) {
    height: 100%;
    padding: $spacing-medium;
  }
}

.review-card {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  
  &.is-flipped {
    transform: rotateY(180deg);
  }
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  padding: $spacing-large;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  
  &.card-back {
    transform: rotateY(180deg);
  }
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .card-label {
    font-size: 14px;
    color: #8696a7;
    margin-bottom: $spacing-medium;
    font-weight: 500;
  }
  
  .card-text-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .card-text {
    font-size: 20px;
    line-height: 1.6;
    color: #2c3e50;
    text-align: center;
    margin: 0;
    padding: 0 $spacing-medium;
    white-space: pre-wrap;
  }
}

.card-footer {
  margin-top: auto;
  padding-top: $spacing-large;
  padding-bottom: 60px;
}

.card-info {
  margin-bottom: $spacing-large;
  
  .info-item {
    display: flex;
    align-items: center;
    color: #8696a7;
    font-size: 14px;
    margin-bottom: $spacing-small;
    
    .van-icon {
      margin-right: $spacing-small;
      font-size: 16px;
    }
  }
}

.card-actions {
  display: flex;
  justify-content: space-between;
  gap: $spacing-medium;
  
  .action-btn {
    flex: 1;
    height: 44px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 12px;
    
    :deep(.van-icon) {
      font-size: 18px;
      margin-right: 4px;
    }
    
    &.success-btn {
      background-color: #34c759;
      border-color: #34c759;
      
      &:active {
        background-color: darken(#34c759, 5%);
        border-color: darken(#34c759, 5%);
      }
    }
    
    &.danger-btn {
      background-color: #ff3b30;
      border-color: #ff3b30;
      
      &:active {
        background-color: darken(#ff3b30, 5%);
        border-color: darken(#ff3b30, 5%);
      }
    }
  }
}

.progress-indicator {
  position: absolute;
  bottom: $spacing-small;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(44, 62, 80, 0.8);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  z-index: 10;
  backdrop-filter: blur(4px);
  
  .current {
    color: #ffffff;
  }
  
  .separator {
    margin: 0 4px;
    opacity: 0.7;
  }
  
  .total {
    opacity: 0.7;
  }
}

.custom-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  :deep(.van-empty__description) {
    color: #8696a7;
    font-size: 16px;
    margin-top: $spacing-medium;
  }
}
</style> 