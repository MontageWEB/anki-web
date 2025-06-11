<template>
  <div class="card-add">
    <van-nav-bar
      title="新增卡片"
      :left-arrow="showBackButton"
      right-text="保存"
      @click-left="handleBack"
      @click-right="handleSave"
    />
    <div class="content">
      <div class="form">
        <!-- 知识点输入 -->
        <div class="form-item">
          <div class="label">知识点</div>
          <van-field
            v-model="formData.title"
            type="textarea"
            placeholder="请输入要记忆的知识点"
            :rules="[{ required: true, message: '请输入知识点' }]"
            rows="3"
            autosize
            maxlength="100"
            show-word-limit
          />
        </div>

        <!-- 答案输入 -->
        <div class="form-item">
          <div class="label">答案</div>
          <van-field
            v-model="formData.answer"
            type="textarea"
            placeholder="请输入答案或解释"
            :rules="[{ required: true, message: '请输入答案' }]"
            rows="6"
            autosize
            maxlength="500"
            show-word-limit
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useCardStore } from '@/store/card'

export default defineComponent({
  name: 'CardAdd',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const cardStore = useCardStore()

    // 根据路由参数判断是否显示返回按钮
    const showBackButton = computed(() => route.query.from === 'list')

    // 表单数据
    const formData = ref({
      title: '',
      answer: ''
    })

    // 返回上一页
    const handleBack = () => {
      router.back()
    }

    // 保存卡片
    const handleSave = async () => {
      // 表单验证
      if (!formData.value.title.trim()) {
        showToast('请输入知识点')
        return
      }
      if (!formData.value.answer.trim()) {
        showToast('请输入答案')
        return
      }

      try {
        // 创建卡片
        await cardStore.addCard({
          title: formData.value.title.trim(),
          answer: formData.value.answer.trim()
        })

        // 返回上一页或卡片库
        if (showBackButton.value) {
          router.back()
        } else {
          router.replace('/card/list')
        }
      } catch (error) {
        console.error('保存失败:', error)
      }
    }

    return {
      formData,
      showBackButton,
      handleBack,
      handleSave
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/_variables' as *;

.card-add {
  min-height: 100vh;
  background-color: $color-background;
}

.content {
  padding: 16px;
}

.form {
  .form-item {
    margin-bottom: 24px;
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .label {
    font-size: 14px;
    color: $color-text-secondary;
    margin-bottom: 8px;
  }
}

:deep(.van-field) {
  padding: 0;
  background-color: transparent;
}

.hint-text {
  color: $color-text-secondary;
}
</style> 