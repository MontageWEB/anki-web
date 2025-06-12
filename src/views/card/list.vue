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
        @search="handleSearch"
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
              <span class="time">创建时间：{{ formatDate(item.createdAt) }}</span>
              <span class="count">已复习：{{ item.reviewCount }}次</span>
              <NextReviewTime :card="item" @update="handleReviewTimeUpdate" />
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
        <div class="left">
          <van-icon name="arrow-left" @click="showDetailPopup = false" />
          <span class="title">卡片详情</span>
        </div>
        <van-button
          plain
          type="primary"
          size="small"
          @click="showEdit(currentCard)"
        >
          编辑
        </van-button>
      </div>
      <div class="popup-content">
        <!-- 知识点 -->
        <div class="section">
          <div class="section-title">知识点</div>
          <div class="section-content">{{ currentCard.title }}</div>
        </div>
        <!-- 答案 -->
        <div class="section">
          <div class="section-title">答案</div>
          <div class="section-content">{{ currentCard.answer }}</div>
        </div>
        <!-- 卡片信息 -->
        <div class="card-info">
          <div class="info-item">
            <span class="label">创建时间</span>
            <span class="value">{{ formatDate(currentCard.createdAt) }}</span>
          </div>
          <div class="info-item">
            <span class="label">已复习次数</span>
            <span class="value">{{ currentCard.reviewCount }}次</span>
          </div>
          <div class="info-item">
            <NextReviewTime 
              v-if="currentCard.id" 
              :card="currentCard" 
              @update="handleDetailReviewTimeUpdate" 
            />
          </div>
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
        <div class="left">
          <van-icon name="arrow-left" @click="handleEditBack" />
          <span class="title">编辑卡片</span>
        </div>
        <van-button
          plain
          type="primary"
          size="small"
          @click="handleSave"
        >
          保存
        </van-button>
      </div>
      <div class="popup-content">
        <div class="form">
          <div class="form-item">
            <div class="label">知识点</div>
            <van-field
              v-model="editForm.title"
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
              v-model="editForm.answer"
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
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog, Popup } from 'vant'
import { formatDate } from '@/utils/date'
import { useCardStore } from '@/store/card'
import NextReviewTime from '@/components/common/NextReviewTime.vue'

export default defineComponent({
  name: 'CardList',
  components: {
    NextReviewTime
  },
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
    const loading = computed(() => cardStore.loading)
    const filteredList = computed(() => {
      if (!searchText.value) return cardStore.allCards || []
      const keyword = searchText.value.toLowerCase()
      return (cardStore.allCards || []).filter(item => 
        item.title.toLowerCase().includes(keyword) ||
        item.answer.toLowerCase().includes(keyword)
      )
    })

    // 页面激活时刷新数据
    onActivated(async () => {
      await cardStore.initializeCards()
    })

    // 初始化加载
    onMounted(async () => {
      await cardStore.initializeCards()
    })

    // 搜索处理
    const handleSearch = async () => {
      await cardStore.setSearchText(searchText.value)
    }

    // 清除搜索
    const handleClear = async () => {
      searchText.value = ''
      await cardStore.setSearchText('')
    }

    // 新增卡片
    const handleAdd = () => {
      router.push({
        path: '/card/create',
        query: { source: 'list' }
      })
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
      // 如果是从详情页进入编辑，关闭详情弹窗
      if (showDetailPopup.value) {
        showDetailPopup.value = false
      }
    }

    // 编辑页返回
    const handleEditBack = () => {
      showEditPopup.value = false
      // 如果是从详情页进入编辑，返回详情页
      if (currentCard.value.id === editForm.value.id) {
        showDetailPopup.value = true
      }
    }

    // 保存编辑
    const handleSave = async () => {
      // 表单验证
      if (!editForm.value.title.trim()) {
        showToast('请输入知识点')
        return
      }
      if (!editForm.value.answer.trim()) {
        showToast('请输入答案')
        return
      }

      try {
        // 更新卡片
        const updatedCard = await cardStore.updateCard(editForm.value.id, {
          title: editForm.value.title.trim(),
          answer: editForm.value.answer.trim()
        })

        // 更新当前卡片数据
        currentCard.value = updatedCard

        // 关闭所有弹窗
        showEditPopup.value = false
        showDetailPopup.value = false

        // 显示成功提示
        showToast({
          type: 'success',
          message: '保存成功'
        })
      } catch (error) {
        console.error('保存失败:', error)
      }
    }

    // 删除卡片
    const handleDelete = (id) => {
      showDialog({
        title: '确认删除',
        message: '确定要删除这张卡片吗？',
        showCancelButton: true
      }).then(async () => {
        try {
          await cardStore.deleteCard(id)
          // 如果删除的是当前正在查看的卡片，关闭所有弹窗
          if (currentCard.value.id === id) {
            showDetailPopup.value = false
            showEditPopup.value = false
          }
        } catch (error) {
          console.error('删除失败:', error)
        }
      }).catch(() => {
        // 取消删除，不做任何操作
      })
    }

    // 处理复习时间更新
    const handleReviewTimeUpdate = async () => {
      await cardStore.initializeCards()
    }

    // 处理详情页中的复习时间更新
    const handleDetailReviewTimeUpdate = async () => {
      await cardStore.initializeCards()
      // 更新当前显示的卡片
      const updatedCard = cardStore.allCards.find(card => card.id === currentCard.value.id)
      if (updatedCard) {
        currentCard.value = { ...updatedCard }
      }
    }

    return {
      // 数据
      searchText,
      loading,
      filteredList,
      showDetailPopup,
      showEditPopup,
      currentCard,
      editForm,

      // 方法
      handleSearch,
      handleClear,
      handleAdd,
      showDetail,
      showEdit,
      handleEditBack,
      handleSave,
      handleDelete,
      formatDate,
      handleReviewTimeUpdate,
      handleDetailReviewTimeUpdate
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
  background-color: $color-background;
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
    color: $color-text-primary;
    margin-bottom: 8px;
  }

  .info {
    margin-top: 8px;
    font-size: 14px;
    color: #666;
    display: flex;
    flex-direction: column;
    gap: 4px;
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
    margin-bottom: 24px;

    .section-title {
      font-size: 14px;
      color: $color-text-secondary;
      margin-bottom: 8px;
    }

    .section-content {
      font-size: 16px;
      line-height: 1.6;
      white-space: pre-wrap;
    }
  }

  .card-info {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #eee;
    
    .info-item {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      
      .label {
        width: 80px;
        color: #666;
        font-size: 14px;
      }
      
      .value {
        flex: 1;
        color: #333;
        font-size: 14px;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

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

.empty-text {
  color: $color-text-secondary;
}

.load-more {
  color: $color-text-secondary;
}

.card-title {
  color: $color-text-primary;
}

.card-meta {
  color: $color-text-secondary;
}
</style> 