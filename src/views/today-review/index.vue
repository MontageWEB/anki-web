<template>
  <div class="today-review">
    <!-- 导航栏 -->
    <van-nav-bar
      title="今日复习"
      fixed
      :border="false"
      :placeholder="true"
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
                <h3 class="card-title">知识点</h3>
                <p class="card-text">{{ card.front }}</p>
              </div>
              <div class="card-info">
                <p>创建时间：{{ formatDate(card.createTime) }}</p>
                <p>已复习：{{ card.reviewCount }}次</p>
                <p>下次复习：{{ formatDate(card.nextReviewTime) }}</p>
              </div>
              <div class="card-actions">
                <van-button 
                  type="success" 
                  size="small" 
                  @click.stop="handleMastered(card)"
                >
                  掌握
                </van-button>
                <van-button 
                  type="danger" 
                  size="small" 
                  @click.stop="handleForgotten(card)"
                >
                  忘记
                </van-button>
              </div>
            </div>
            <!-- 卡片反面 -->
            <div class="card-face card-back" @click="handleFlip(card)">
              <div class="card-content">
                <h3 class="card-title">答案</h3>
                <p class="card-text">{{ card.back }}</p>
              </div>
              <div class="card-info">
                <p>创建时间：{{ formatDate(card.createTime) }}</p>
                <p>已复习：{{ card.reviewCount }}次</p>
                <p>下次复习：{{ formatDate(card.nextReviewTime) }}</p>
              </div>
              <div class="card-actions">
                <van-button 
                  type="success" 
                  size="small" 
                  @click.stop="handleMastered(card)"
                >
                  掌握
                </van-button>
                <van-button 
                  type="danger" 
                  size="small" 
                  @click.stop="handleForgotten(card)"
                >
                  忘记
                </van-button>
              </div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 无卡片提示 -->
    <van-empty
      v-else
      class="empty-tip"
      description="今天没有需要复习的卡片"
    >
      <template #image>
        <van-icon name="smile-o" size="64" />
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
  today.setHours(0, 0, 0, 0)
  
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
  router.push('/card/add')
}

onMounted(() => {
  fetchTodayCards()
})
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.today-review {
  background-color: $color-background;
  min-height: 100vh;
  padding: $spacing-medium;
}

.card-container {
  margin-top: $spacing-large;
  height: calc(100vh - 200px);
  
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
  transition: transform 0.6s;
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
  background-color: #fff;
  border-radius: $border-radius-large;
  padding: $spacing-medium;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-back {
  transform: rotateY(180deg);
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-large;
  color: $color-text-primary;
}

.card-footer {
  text-align: center;
  color: $color-text-primary;
}

.card-hint {
  color: $color-text-secondary;
  font-size: $font-size-small;
}

.card-title {
  font-size: $font-size-large;
  margin-bottom: $spacing-medium;
  color: $color-text-primary;
}

.card-text {
  font-size: $font-size-normal;
  line-height: 1.6;
  color: $color-text-primary;
  white-space: pre-wrap;
}

.card-info {
  margin: $spacing-medium 0;
  font-size: $font-size-small;
  color: $color-text-secondary;
  
  p {
    margin: $spacing-small 0;
  }
}

.card-actions {
  display: flex;
  justify-content: space-around;
  padding: $spacing-medium 0;
  
  .van-button {
    width: 120px;
  }
}

.empty-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style> 