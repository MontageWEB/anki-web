<template>
  <div class="card-library">
    <!-- ... existing code ... -->
    
    <!-- 卡片列表 -->
    <div class="card-list">
      <div v-for="card in filteredCards" :key="card.id" class="card-item">
        <div class="card-content">
          <div class="question" @click="showCardDetail(card)">{{ card.question }}</div>
          <div class="meta-info">
            <div class="created-time">创建时间：{{ formatDate(card.createdTime) }}</div>
            <div class="review-count">已复习次数：{{ card.reviewCount }}</div>
            <NextReviewTime 
              :card="card" 
              @update="handleReviewTimeUpdate" 
            />
          </div>
        </div>
        <!-- ... existing swipe actions ... -->
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
  // 重新获取所有卡片
  const updatedCards = await storage.getAllCards()
  cards.value = updatedCards
}

// ... existing code ...
</script>

<style lang="scss" scoped>
.card-list {
  padding: 16px;
  
  .card-item {
    background: #fff;
    border-radius: 8px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .card-content {
      padding: 16px;
      
      .question {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 12px;
        color: #333;
        cursor: pointer;
        
        &:hover {
          color: #1989fa;
        }
      }
    }
  }
}

.meta-info {
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