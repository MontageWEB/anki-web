<template>
  <div class="interval-settings">
    <van-nav-bar
      title="复习间隔规则"
      left-arrow
      @click-left="router.back()"
    />
    <div class="content">
      <div class="section">
        <div class="section-title">复习规则设置</div>
        <div class="section-desc">
          <van-icon name="info-o" class="info-icon" />
          <span>设置每次复习后的间隔天数，系统会根据复习次数自动计算下次复习时间。</span>
        </div>
        <div class="rules-list">
          <div v-for="(rule, index) in rules" :key="index" class="rule-item">
            <span class="rule-label">第{{ index + 1 }}次</span>
            <div class="input-wrapper">
              <van-field
                v-model="rule.days"
                type="number"
                placeholder="请输入间隔天数"
                :rules="[
                  { required: true, message: '请输入间隔天数' },
                  { validator: validateDays, message: '间隔天数必须为1-365之间的整数' }
                ]"
              >
                <template #right-icon>
                  <span class="unit">天</span>
                </template>
              </van-field>
            </div>
          </div>
        </div>
        <div class="action-buttons">
          <van-button type="primary" block :loading="saving" @click="handleSave">保存</van-button>
          <van-button plain type="warning" block :loading="resetting" @click="handleReset">恢复默认</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast, showToast, showDialog } from 'vant'
import { getReviewRules, updateReviewRules, resetReviewRules } from '@/api/review'

const router = useRouter()

const defaultRules = [
  { days: 1 },  { days: 1 },  { days: 1 },  { days: 2 },  { days: 3 },
  { days: 5 },  { days: 7 },  { days: 7 },  { days: 14 }, { days: 14 },
  { days: 30 }, { days: 30 }, { days: 60 }, { days: 60 }, { days: 60 },
  { days: 60 }, { days: 60 }, { days: 60 }, { days: 60 }, { days: 60 }
]

const rules = ref([])
const saving = ref(false)
const resetting = ref(false)

const validateDays = (value) => {
  const days = parseInt(value)
  return !isNaN(days) && days >= 1 && days <= 365 && Number.isInteger(days)
}

const fetchRules = async () => {
  try {
    const { items } = await getReviewRules()
    if (items && items.length === 20) {
      rules.value = items.map(item => ({ days: item.interval_days }))
    } else {
      rules.value = JSON.parse(JSON.stringify(defaultRules))
    }
  } catch (error) {
    showToast('获取规则失败')
    rules.value = JSON.parse(JSON.stringify(defaultRules))
  }
}

const handleSave = async () => {
  if (!rules.value.every(rule => validateDays(rule.days))) {
    showToast('请检查所有间隔天数是否有效')
    return
  }
  saving.value = true
  try {
    await updateReviewRules({
      rules: rules.value.map((rule, idx) => ({
        review_count: idx + 1,
        interval_days: parseInt(rule.days)
      }))
    })
    showSuccessToast('设置已保存')
  } catch (e) {
    showToast('保存失败')
  } finally {
    saving.value = false
  }
}

const handleReset = () => {
  showDialog({
    title: '恢复默认设置',
    message: '确定要恢复默认的间隔规则吗？',
    showCancelButton: true
  }).then(async () => {
    resetting.value = true
    try {
      await resetReviewRules()
      await fetchRules()
      showSuccessToast('已恢复默认规则')
    } catch (error) {
      showToast('恢复默认失败')
    } finally {
      resetting.value = false
    }
  })
}

onMounted(() => {
  fetchRules()
})
</script>

<style lang="scss" scoped>
@use '@/styles/_variables' as *;

.interval-settings {
  min-height: 100vh;
  background-color: $color-background;

  .content {
    padding: 16px;
  }
}

.section {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
  }

  .section-desc {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: $color-text-secondary;
    line-height: 1.5;
    margin-bottom: 16px;
    padding: 8px 12px;
    background-color: rgba($color-primary, 0.05);
    border-radius: 4px;

    .info-icon {
      margin-right: 8px;
      color: $color-primary;
    }
  }
}

.rules-list {
  .rule-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .rule-label {
      width: 60px;
      font-size: 14px;
      color: $color-text-primary;
    }

    .input-wrapper {
      flex: 1;
      display: flex;
      justify-content: flex-end;

      :deep(.van-field) {
        width: 120px;
        padding: 0;
      }

      .unit {
        color: $color-text-secondary;
        margin-left: 4px;
      }
    }
  }
}

.action-buttons {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style> 