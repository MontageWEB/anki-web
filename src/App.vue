<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Tabbar, TabbarItem } from 'vant'

const router = useRouter()
const route = useRoute()
const active = ref(0)

const tabs = [
  {
    name: '首页',
    icon: 'home-o',
    path: '/'
  },
  {
    name: '复习',
    icon: 'records',
    path: '/review'
  },
  {
    name: '管理',
    icon: 'setting-o',
    path: '/manage'
  },
  {
    name: '统计',
    icon: 'chart-trending-o',
    path: '/statistics'
  }
]

const onChange = (index) => {
  router.push(tabs[index].path)
}
</script>

<template>
  <div class="app">
    <main class="main">
      <router-view></router-view>
    </main>
    <Tabbar v-model="active" @change="onChange">
      <TabbarItem 
        v-for="(tab, index) in tabs" 
        :key="index"
        :icon="tab.icon"
      >
        {{ tab.name }}
      </TabbarItem>
    </Tabbar>
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
