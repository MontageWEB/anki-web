<script setup>
import TabBar from '@/components/common/TabBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
// 需要显示 TabBar 的一级页面路径
const tabBarPages = ['/today-review', '/card/list', '/settings']
const showTabBar = computed(() => tabBarPages.includes(route.path))
</script>

<template>
  <div class="app">
    <main class="main">
      <router-view></router-view>
    </main>
    <TabBar v-if="showTabBar" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding: 20px;
  padding-bottom: 70px; /* 为底部导航留出空间 */
}

:root {
  --van-primary-color: #1890ff;
}
</style>
