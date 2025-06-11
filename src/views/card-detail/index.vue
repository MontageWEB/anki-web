<template>
  <div class="card-detail">
    <!-- ... existing code ... -->
    
    <div class="content">
      <div class="question-section">
        <h3>知识点</h3>
        <div class="question">{{ card.question }}</div>
      </div>
      
      <div class="answer-section">
        <h3>答案</h3>
        <div class="answer">{{ card.answer }}</div>
      </div>
      
      <div class="meta-info">
        <div class="created-time">创建时间：{{ formatDate(card.createdTime) }}</div>
        <div class="review-count">已复习次数：{{ card.reviewCount }}</div>
        <NextReviewTime 
          :card="card" 
          @update="handleReviewTimeUpdate" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import storage from '@/utils/storage'
import NextReviewTime from '@/components/common/NextReviewTime.vue'

// ... existing code ...

// 处理复习时间更新
const handleReviewTimeUpdate = async () => {
  // 重新获取卡片详情
  const updatedCard = await storage.getCard(props.cardId)
  card.value = updatedCard
}

// ... existing code ...
</script>

<style lang="scss" scoped>
// ... existing styles ...

.meta-info {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  font-size: 14px;
  color: #666;
  
  > div {
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style> 