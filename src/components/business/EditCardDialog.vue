<template>
  <van-popup
    v-model:show="localShow"
    position="bottom"
    round
    class="edit-popup"
  >
    <div class="popup-header">
      <div class="left">
        <van-icon name="arrow-left" @click="onCancel" />
        <span class="title">编辑卡片</span>
      </div>
      <div class="right">
        <van-button
          plain
          type="danger"
          size="small"
          class="delete-btn"
          v-if="showDelete"
          @click="onDelete"
        >
          删除
        </van-button>
        <van-button
          plain
          type="primary"
          size="small"
          @click="handleSave"
        >
          保存
        </van-button>
      </div>
    </div>
    <div class="popup-content">
      <div class="form">
        <div class="form-item">
          <div class="label">知识点</div>
          <van-field
            v-model="form.title"
            type="textarea"
            placeholder="请输入知识点"
            :rules="[{ required: true, message: '请输入知识点' }]"
            rows="3"
            autosize
            maxlength="100"
            show-word-limit
          />
        </div>
        <div class="form-item">
          <div class="label">答案</div>
          <van-field
            v-model="form.answer"
            type="textarea"
            placeholder="请输入答案"
            :rules="[{ required: true, message: '请输入答案' }]"
            rows="6"
            autosize
            maxlength="500"
            show-word-limit
          />
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import { showToast } from 'vant'

const props = defineProps({
  show: Boolean,
  card: {
    type: Object,
    default: () => ({})
  },
  showDelete: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:show', 'save', 'cancel', 'delete'])

const localShow = ref(props.show)
watch(() => props.show, val => { localShow.value = val })
watch(localShow, val => { if (val !== props.show) emit('update:show', val) })

const form = reactive({
  id: '',
  title: '',
  answer: ''
})

watch(() => props.card, (val) => {
  form.id = val.id || ''
  form.title = val.title || ''
  form.answer = val.answer || ''
}, { immediate: true, deep: true })

watch(localShow, (val) => {
  if (!val) {
    // 关闭时重置表单
    form.id = ''
    form.title = ''
    form.answer = ''
  }
})

function handleSave() {
  if (!form.title.trim()) {
    showToast('请输入知识点')
    return
  }
  if (!form.answer.trim()) {
    showToast('请输入答案')
    return
  }
  emit('save', { ...form })
}
function onCancel() {
  localShow.value = false
  emit('cancel')
}
function onDelete() {
  emit('delete', form.id)
}
</script>

<style lang="scss" scoped>
@use '@/styles/_variables' as *;
.edit-popup {
  min-height: 60vh;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
  .left {
    display: flex;
    align-items: center;
    gap: 8px;
    .van-icon {
      font-size: 20px;
      cursor: pointer;
    }
  }
  .right {
    display: flex;
    gap: 8px;
  }
  .title {
    font-size: 16px;
    font-weight: 500;
  }
  .delete-btn {
    margin-right: 8px;
  }
}
.popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  .form {
    .form-item {
      margin-bottom: 24px;
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
}
</style> 