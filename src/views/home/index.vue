<template>
  <div class="home">
    <h1>Anki复习助手</h1>
    <div class="stats">
      <div class="stat-item">
        <h3>今日待复习</h3>
        <p>{{ todayReview }}</p>
      </div>
      <div class="stat-item">
        <h3>累计学习</h3>
        <p>{{ totalLearned }}</p>
      </div>
    </div>
    <div class="actions">
      <button @click="startReview">开始复习</button>
      <button @click="manageCards">管理卡片</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const todayReview = ref(0)
const totalLearned = ref(0)

const startReview = () => {
  router.push('/review')
}

const manageCards = () => {
  router.push('/manage')
}
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.stat-item {
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  margin: 0 auto;
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  background-color: #1890ff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #40a9ff;
}
</style> 