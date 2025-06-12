<template>
  <div class="card-create">
    <van-nav-bar
      :title="title"
      :left-text="showBack ? '返回' : ''"
      :left-arrow="showBack"
      @click-left="onClickLeft"
    >
      <template #right>
        <van-button
          type="primary"
          size="small"
          :loading="loading"
          :disabled="!isValid"
          @click="onSave"
        >
          保存
        </van-button>
      </template>
    </van-nav-bar>

    <div class="form-container">
      <van-form @submit="onSave">
        <van-cell-group inset>
          <van-field
            v-model="formData.title"
            label="知识点"
            type="textarea"
            placeholder="请输入知识点，最多100字"
            :rules="[
              { required: true, message: '请输入知识点' },
              { max: 100, message: '知识点最多100字' }
            ]"
            :autosize="{ minHeight: 100 }"
          />
          <van-field
            v-model="formData.answer"
            label="答案"
            type="textarea"
            placeholder="请输入答案，最多500字"
            :rules="[
              { required: true, message: '请输入答案' },
              { max: 500, message: '答案最多500字' }
            ]"
            :autosize="{ minHeight: 200 }"
          />
        </van-cell-group>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showSuccessToast, showToast } from 'vant'
import { createCard } from '@/api/card'

const router = useRouter()
const route = useRoute()

// 根据来源决定是否显示返回按钮和返回行为
const source = route.query.source || 'review'
const showBack = true
const title = '新增卡片'

// 表单数据
const formData = ref({
  title: '',
  answer: ''
})

// 表单验证
const isValid = computed(() => {
  const { title, answer } = formData.value
  return title.trim() && answer.trim() && 
         title.length <= 100 && answer.length <= 500
})

// 加载状态
const loading = ref(false)

// 返回按钮处理
const onClickLeft = () => {
  router.back()
}

// 保存处理
const onSave = async () => {
  if (!isValid.value || loading.value) return

  loading.value = true
  try {
    await createCard(formData.value)
    showSuccessToast('创建成功')

    // 根据来源决定保存后的行为
    if (source === 'review') {
      // 从今日复习页面进入：返回并刷新数据
      router.back()
    } else if (source === 'list') {
      // 从卡片库进入：返回并刷新数据
      router.back()
    }
  } catch (error) {
    console.error('创建卡片失败:', error)
    showToast({
      type: 'fail',
      message: '创建失败'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.card-create {
  height: 100vh;
  background-color: #f7f8fa;

  .form-container {
    padding: 16px;
  }

  :deep(.van-field__label) {
    width: 4em;
  }
}
</style> 