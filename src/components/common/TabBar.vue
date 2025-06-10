<template>
  <van-tabbar v-model="active" route>
    <van-tabbar-item
      to="/today-review"
      icon="clock-o"
    >
      今日复习
    </van-tabbar-item>
    <van-tabbar-item
      to="/card/add"
      icon="plus"
    >
      新增卡片
    </van-tabbar-item>
    <van-tabbar-item
      to="/card/list"
      icon="notes-o"
    >
      卡片库
    </van-tabbar-item>
    <van-tabbar-item
      to="/settings"
      icon="setting-o"
    >
      设置
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'TabBar',
  setup() {
    const active = ref(0)
    return { active }
  }
})
</script> 