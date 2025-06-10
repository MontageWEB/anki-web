<template>
  <div class="card-list">
    <!-- 导航栏 -->
    <van-nav-bar
      title="卡片库"
      right-text="新增"
      @click-right="handleAdd"
    />

    <!-- 搜索栏 -->
    <div class="search-bar">
      <van-search
        v-model="searchText"
        placeholder="搜索知识点或答案"
        shape="round"
        clearable
        @clear="handleClear"
      />
    </div>

    <!-- 卡片列表 -->
    <div class="list-container">
      <van-empty v-if="!loading && filteredList.length === 0" description="暂无卡片" />
      <van-loading v-else-if="loading" type="spinner" vertical>加载中...</van-loading>
      <template v-else>
        <van-swipe-cell
          v-for="item in filteredList"
          :key="item.id"
          class="list-item"
        >
          <!-- 卡片内容 -->
          <div class="card-content" @click="showDetail(item)">
            <div class="title">{{ item.title }}</div>
            <div class="info">
              <span class="time">创建时间：{{ formatDate(item.createTime) }}</span>
              <span class="count">已复习：{{ item.reviewCount }}次</span>
              <span class="next-time">下次复习：{{ formatDate(item.nextReviewTime) }}</span>
            </div>
          </div>

          <!-- 左滑操作 -->
          <template #right>
            <div class="swipe-actions">
              <van-button
                square
                text="编辑"
                type="primary"
                class="edit-btn"
                @click="showEdit(item)"
              />
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-btn"
                @click="handleDelete(item.id)"
              />
            </div>
          </template>
        </van-swipe-cell>
      </template>
    </div>

    <!-- 详情弹窗 -->
    <van-popup
      v-model:show="showDetailPopup"
      position="bottom"
      round
      class="detail-popup"
    >
      <div class="popup-header">
        <span class="title">卡片详情</span>
        <van-icon name="cross" @click="showDetailPopup = false" />
      </div>
      <div class="popup-content">
        <div class="section">
          <div class="section-title">知识点</div>
          <div class="section-content">{{ currentCard.title }}</div>
        </div>
        <div class="section">
          <div class="section-title">答案</div>
          <div class="section-content">{{ currentCard.answer }}</div>
        </div>
      </div>
    </van-popup>

    <!-- 编辑弹窗 -->
    <van-popup
      v-model:show="showEditPopup"
      position="bottom"
      round
      class="edit-popup"
    >
      <div class="popup-header">
        <span class="title">编辑卡片</span>
        <van-icon name="cross" @click="showEditPopup = false" />
      </div>
      <div class="popup-content">
        <div class="form">
          <div class="form-item">
            <div class="label">知识点</div>
            <van-field
              v-model="editForm.title"
              type="textarea"
              placeholder="请输入知识点"
              rows="3"
              autosize
            />
          </div>
          <div class="form-item">
            <div class="label">答案</div>
            <van-field
              v-model="editForm.answer"
              type="textarea"
              placeholder="请输入答案"
              rows="6"
              autosize
            />
          </div>
        </div>
        <div class="popup-footer">
          <van-button block type="primary" @click="handleSave">保存</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, Toast } from 'vant'
import { formatDate } from '@/utils/date'
import { useCardStore } from '@/store/card'

export default defineComponent({
  name: 'CardList',
  setup() {
    const router = useRouter()
    const cardStore = useCardStore()
    const searchText = ref('')

    // 弹窗控制
    const showDetailPopup = ref(false)
    const showEditPopup = ref(false)
    const currentCard = ref({})
    const editForm = ref({
      id: '',
      title: '',
      answer: ''
    })

    // 初始化数据
    onMounted(async () => {
      await cardStore.initializeCards()
    })

    // 根据搜索文本过滤列表
    const filteredList = computed(() => {
      if (!searchText.value) return cardStore.allCards
      const keyword = searchText.value.toLowerCase()
      return cardStore.allCards.filter(item => 
        item.title.toLowerCase().includes(keyword) ||
        item.answer.toLowerCase().includes(keyword)
      )
    })

    // 新增卡片
    const handleAdd = () => {
      router.push({
        path: '/card/add',
        query: { from: 'list' }
      })
    }

    // 清空搜索
    const handleClear = () => {
      searchText.value = ''
    }

    // 显示详情
    const showDetail = (item) => {
      currentCard.value = item
      showDetailPopup.value = true
    }

    // 显示编辑
    const showEdit = (item) => {
      editForm.value = { ...item }
      showEditPopup.value = true
    }

    // 保存编辑
    const handleSave = async () => {
      if (!editForm.value.title.trim()) {
        Toast('请输入知识点')
        return
      }
      if (!editForm.value.answer.trim()) {
        Toast('请输入答案')
        return
      }

      try {
        await cardStore.updateCard(editForm.value.id, {
          title: editForm.value.title.trim(),
          answer: editForm.value.answer.trim()
        })
        showEditPopup.value = false
      } catch (error) {
        console.error('保存失败:', error)
      }
    }

    // 删除卡片
    const handleDelete = (id) => {
      Dialog.confirm({
        title: '确认删除',
        message: '确定要删除这张卡片吗？',
        beforeClose: async (action) => {
          if (action === 'confirm') {
            try {
              await cardStore.deleteCard(id)
              return true
            } catch (error) {
              console.error('删除失败:', error)
              return false
            }
          }
          return true
        }
      })
    }

    return {
      searchText,
      filteredList,
      showDetailPopup,
      showEditPopup,
      currentCard,
      editForm,
      loading: computed(() => cardStore.loading),
      handleAdd,
      handleClear,
      showDetail,
      showEdit,
      handleSave,
      handleDelete,
      formatDate
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/_variables' as *;

.card-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $background-color;
}

.search-bar {
  padding: 8px 16px;
  background-color: #fff;
}

.list-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.list-item {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }
}

.card-content {
  padding: 16px;
  background-color: #fff;

  .title {
    font-size: 16px;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: 8px;
  }

  .info {
    font-size: 12px;
    color: $text-secondary;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.swipe-actions {
  height: 100%;
  display: flex;

  .van-button {
    height: 100%;
    width: 60px;
  }
}

.detail-popup,
.edit-popup {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.popup-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;

  .title {
    font-size: 16px;
    font-weight: 500;
  }
}

.popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  .section {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .section-title {
    font-size: 14px;
    color: $text-secondary;
    margin-bottom: 8px;
  }

  .section-content {
    font-size: 16px;
    color: $text-primary;
    line-height: 1.6;
  }
}

.form {
  .form-item {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .label {
    font-size: 14px;
    color: $text-secondary;
    margin-bottom: 8px;
  }
}

.popup-footer {
  padding: 16px;
  border-top: 1px solid #eee;
}
</style> 