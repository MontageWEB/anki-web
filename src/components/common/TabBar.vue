<template>
  <van-tabbar v-model="active" route>
    <van-tabbar-item
      to="/today-review"
      icon="clock-o"
      :class="{ active: isActive('/today-review') }"
    >
      今日复习
    </van-tabbar-item>
    <van-tabbar-item
      to="/card/list"
      icon="notes-o"
      :class="{ active: isActive('/card/list') }"
    >
      卡片库
    </van-tabbar-item>
    <van-tabbar-item
      to="/settings"
      icon="setting-o"
      :class="{ active: isActive('/settings') }"
    >
      设置
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref(0)

// 判断导航项是否高亮
const isActive = (path) => {
  return route.path === path || route.meta.parent === path
}
</script>

<style scoped>
.active {
  color: var(--van-primary-color);
}
</style> 