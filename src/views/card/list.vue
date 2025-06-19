<template>
  <div class="card-list">
    <!-- 导航栏 -->
    <van-nav-bar
      title="卡片库"
      right-text="新增"
      @click-right="handleAdd"
      fixed
      :placeholder="true"
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
          <div class="card-content" @click="showEdit(item)">
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

    <!-- 编辑弹窗 -->
    <EditCardDialog
      v-model:show="showEditPopup"
      :card="editForm"
      :showDelete="true"
      @save="handleSave"
      @cancel="handleEditBack"
      @delete="handleDelete"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog, Popup } from 'vant'
import { formatDate, formatDateYMD } from '@/utils/date'
import { useCardStore } from '@/store/card'
import NextReviewTime from '@/components/common/NextReviewTime.vue'
import EditCardDialog from '@/components/business/EditCardDialog.vue'

export default defineComponent({
  name: 'CardList',
  components: {
    NextReviewTime,
    EditCardDialog
  },
  setup() {
    const router = useRouter()
    const cardStore = useCardStore()
    const searchText = ref('')

    // 弹窗控制
    const showEditPopup = ref(false)
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

    // 显示编辑
    const showEdit = (item) => {
      editForm.value = {
        ...item,
        createdAt: formatDateYMD(item.createdAt),
        reviewCount: item.reviewCount ?? 0,
        nextReviewTime: item.nextReviewTime || item.next_review_time || item.next_reviewTime || ''
      }
      showEditPopup.value = true
    }

    // 编辑页返回
    const handleEditBack = () => {
      showEditPopup.value = false
    }

    // 保存编辑
    const handleSave = async (data) => {
      // 表单验证
      if (!data.title.trim()) {
        showToast('请输入知识点')
        return
      }
      if (!data.answer.trim()) {
        showToast('请输入答案')
        return
      }
      try {
        // 更新卡片
        const updatedCard = await cardStore.updateCard(data.id, {
          title: data.title.trim(),
          answer: data.answer.trim()
        })
        // 更新当前卡片数据
        editForm.value = updatedCard
        // 关闭所有弹窗
        showEditPopup.value = false
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
          showEditPopup.value = false
          await cardStore.initializeCards()
        } catch (error) {
          console.error('删除失败:', error)
        }
      }).catch(() => {
        // 取消删除，不做任何操作
      })
    }

    // 处理复习时间更新
    const handleReviewTimeUpdate = async () => {
      // 重新获取卡片列表数据
      await cardStore.initializeCards()
      // 更新搜索结果
      if (searchText.value) {
        filteredList.value = cardStore.filteredCards(searchText.value)
      } else {
        filteredList.value = cardStore.allCards
      }
    }

    return {
      // 数据
      searchText,
      loading,
      filteredList,
      showEditPopup,
      editForm,

      // 方法
      handleSearch,
      handleClear,
      handleAdd,
      showEdit,
      handleEditBack,
      handleSave,
      handleDelete,
      formatDate,
      handleReviewTimeUpdate
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