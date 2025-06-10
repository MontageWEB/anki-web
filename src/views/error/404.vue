<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，您访问的页面不存在</p>
    <button @click="goHome">返回首页</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 40px 20px;
}

h1 {
  font-size: 72px;
  color: #1890ff;
  margin: 0;
}

p {
  color: #666;
  margin: 20px 0;
}

button {
  padding: 12px 24px;
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