<template>
  <div class="today-review">
    <!-- 顶部导航栏 -->
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

    <div class="review-main">
      <template v-if="todayCards.length > 0">
        <!-- 进度条 -->
        <div class="progress-bar">
          <div class="progress-label">
            <i class="fas fa-layer-group"></i>
            <span>{{ currentIndex + 1 }} / {{ todayCards.length }}</span>
          </div>
          <div class="progress-track">
            <div class="progress-inner" :style="{ width: ((currentIndex + 1) / todayCards.length * 100) + '%' }"></div>
          </div>
        </div>

        <!-- 卡片区域（仅标题、知识点/答案，正反面切换） -->
        <div class="card-container">
          <van-swipe
            :loop="false"
            :show-indicators="false"
            @change="handleCardChange"
          >
            <van-swipe-item v-for="card in todayCards" :key="card.id">
              <div class="review-card" :class="{ 'is-flipped': card.isFlipped }">
                <!-- 卡片正面 -->
                <div class="card-face card-front" @click="handleFlip(card)">
                  <div class="card-content-main">知识点</div>
                  <div class="card-title">{{ card.title }}</div>
                </div>
                <!-- 卡片反面 -->
                <div class="card-face card-back" @click="handleFlip(card)">
                  <div class="card-content-main">答案</div>
                  <div class="card-title">{{ card.answer }}</div>
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>

        <!-- 复习信息区（卡片下方） -->
        <div class="review-meta-bar">
          <div class="meta-item">
            <i class="fas fa-history"></i>
            <span>复习次数：</span>{{ todayCards[currentIndex]?.reviewCount || 0 }}
          </div>
          <div class="meta-item">
            <NextReviewTime
              v-if="todayCards[currentIndex]"
              :card="todayCards[currentIndex]"
              @update="fetchTodayCards"
            />
          </div>
        </div>

        <!-- 操作按钮区 -->
        <div class="review-actions">
          <van-button 
            type="danger" 
            size="large"
            class="action-btn danger-btn" 
            @click="handleForgotten(todayCards[currentIndex])"
          >
            <i class="fas fa-times-circle"></i> 忘记
          </van-button>
          <van-button 
            type="success" 
            size="large"
            class="action-btn success-btn" 
            @click="handleMastered(todayCards[currentIndex])"
          >
            <i class="fas fa-check-circle"></i> 掌握
          </van-button>
        </div>
      </template>
      <template v-else>
        <!-- 无卡片提示 -->
        <van-empty
          class="custom-empty"
          description="今天没有需要复习的卡片"
        >
          <template #image>
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=120&q=80" class="empty-image" alt="empty" />
          </template>
        </van-empty>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast, showToast, Swipe, SwipeItem } from 'vant'
import { useCardStore } from '@/store/card'
import NextReviewTime from '@/components/common/NextReviewTime.vue'

const router = useRouter()
const cardStore = useCardStore()
const todayCards = ref([])
const currentIndex = ref(0)

// 配图（可根据实际业务动态生成）
const frontImageUrl = 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
const backImageUrl = 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'

// 页面激活时刷新数据
onActivated(async () => {
  await fetchTodayCards()
})

// 初始化加载
onMounted(async () => {
  await fetchTodayCards()
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '--'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '--'
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
}

// 获取今日需要复习的卡片
const fetchTodayCards = async () => {
  try {
    await cardStore.fetchTodayCards({
      page: 1,
      per_page: 100 // 获取足够多的卡片
    })
    todayCards.value = cardStore.todayCards
  } catch (error) {
    console.error('获取今日卡片失败:', error)
    showToast('获取今日卡片失败')
  }
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
  try {
    await cardStore.updateReviewStatus(card.id, true)
    showSuccessToast('已掌握，下次复习时间已更新')
    await fetchTodayCards()
  } catch (error) {
    console.error('更新复习状态失败:', error)
  }
}

// 处理忘记按钮点击
const handleForgotten = async (card) => {
  try {
    await cardStore.updateReviewStatus(card.id, false)
    showSuccessToast('已重置，需要重新开始复习')
    await fetchTodayCards()
  } catch (error) {
    console.error('更新复习状态失败:', error)
  }
}

// 跳转到新增卡片页面
const handleAdd = () => {
  router.push({
    path: '/card/create',
    query: { source: 'review' }
  })
}
</script>

<style lang="scss" scoped>
@use '@/styles/_variables' as *;

.today-review {
  min-height: 100vh;
  background: #f6f8fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .custom-nav {
    background: #f6f8fa;
    box-shadow: none;
    :deep(.van-nav-bar__title) {
      color: #222;
      font-weight: 700;
      font-size: 20px;
      letter-spacing: 1px;
    }
    :deep(.van-icon) {
      color: #338aff;
      font-size: 24px;
    }
  }
  .review-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    min-height: 0;
    padding-bottom: 0;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
  }
}

.progress-bar {
  width: 100%;
  margin-top: 16px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  .progress-label {
    font-size: 15px;
    color: #338aff;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
  }
  .progress-track {
    flex: 1;
    height: 8px;
    background: #e3eaf1;
    border-radius: 4px;
    overflow: hidden;
    margin-left: 8px;
    .progress-inner {
      height: 100%;
      background: linear-gradient(90deg, #338aff 0%, #34c759 100%);
      border-radius: 4px;
      transition: width 0.3s;
    }
  }
}

.card-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44vh;
  min-height: 220px;
  max-height: 52vh;
  margin-top: 8px;
  margin-bottom: 0;
  position: relative;
  :deep(.van-swipe) {
    height: 100%;
    width: 100%;
  }
  :deep(.van-swipe-item) {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.review-card {
  width: 100%;
  max-width: 420px;
  height: 100%;
  min-height: 220px;
  position: relative;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px 0 rgba(51,138,255,0.08);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 28px;
  transition: box-shadow 0.2s;
  border: 1.5px solid #e3eaf1;
  perspective: 1200px;
  overflow: hidden;
  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: none;
    border-radius: 20px;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: none;
    backface-visibility: hidden;
    transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
    cursor: pointer;
  }
  .card-front {
    background: #fff;
    z-index: 2;
    transform: rotateY(0deg);
  }
  .card-back {
    background: #fff;
    z-index: 1;
    transform: rotateY(180deg);
  }
  &.is-flipped .card-front {
    transform: rotateY(-180deg);
  }
  &.is-flipped .card-back {
    transform: rotateY(0deg);
    z-index: 3;
  }
  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: #222;
    margin-bottom: 12px;
    text-align: center;
    letter-spacing: 1px;
  }
  .card-content-main {
    font-size: 22px;
    line-height: 1.7;
    color: #338aff;
    text-align: center;
    font-weight: 500;
    word-break: break-word;
    margin-bottom: 12px;
  }
}

.review-meta-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 18px 0 0 0;
  padding: 0 12px;
  .meta-item {
    font-size: 15px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.review-actions {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin: 32px 0 0 0;
  padding: 0 24px 0 24px;
  .action-btn {
    min-width: 100px;
    max-width: 160px;
    flex: 0 1 auto;
    height: 44px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 22px;
    border: none;
    box-shadow: none;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 20px;
      margin-right: 6px;
    }
    &.success-btn {
      background: #338aff;
      color: #fff;
    }
    &.danger-btn {
      background: #e3eaf1;
      color: #338aff;
    }
  }
}

.custom-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  :deep(.van-empty__description) {
    color: #b0b8c1;
    font-size: 16px;
    margin-top: 18px;
  }
  .empty-image {
    width: 120px;
    height: 120px;
    border-radius: 60px;
    object-fit: cover;
    box-shadow: 0 8px 16px rgba(51,138,255,0.08);
  }
}
</style> 