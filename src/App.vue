<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/" class="nav-item">首页</router-link>
      <router-link to="/review" class="nav-item">复习</router-link>
      <router-link to="/manage" class="nav-item">管理</router-link>
      <router-link to="/statistics" class="nav-item">统计</router-link>
    </nav>
    <main class="main">
      <router-view></router-view>
    </main>
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

.nav {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.nav-item {
  text-decoration: none;
  color: #666;
  padding: 8px 12px;
  border-radius: 4px;
}

.nav-item.router-link-active {
  color: #1890ff;
  background-color: #e6f7ff;
}

.main {
  flex: 1;
  padding: 20px;
  padding-bottom: 70px; /* 为底部导航留出空间 */
}
</style>
