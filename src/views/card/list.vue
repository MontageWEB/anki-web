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
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, Toast } from 'vant'
import { formatDate } from '@/utils/date'

export default defineComponent({
  name: 'CardList',
  setup() {
    const router = useRouter()
    const searchText = ref('')
    const cardList = ref([]) // 实际使用时从 store 或 API 获取

    // 弹窗控制
    const showDetailPopup = ref(false)
    const showEditPopup = ref(false)
    const currentCard = ref({})
    const editForm = ref({
      id: '',
      title: '',
      answer: ''
    })

    // 根据搜索文本过滤列表
    const filteredList = computed(() => {
      if (!searchText.value) return cardList.value
      const keyword = searchText.value.toLowerCase()
      return cardList.value.filter(item => 
        item.title.toLowerCase().includes(keyword) ||
        item.answer.toLowerCase().includes(keyword)
      )
    })

    // 新增卡片
    const handleAdd = () => {
      router.push('/card/add')
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
    const handleSave = () => {
      if (!editForm.value.title.trim()) {
        Toast('请输入知识点')
        return
      }
      if (!editForm.value.answer.trim()) {
        Toast('请输入答案')
        return
      }

      // 实际保存逻辑
      console.log('保存卡片:', editForm.value)
      showEditPopup.value = false
    }

    // 删除卡片
    const handleDelete = (id) => {
      Dialog.confirm({
        title: '确认删除',
        message: '确定要删除这张卡片吗？',
      }).then(() => {
        // 实际删除逻辑
        console.log('删除卡片:', id)
      })
    }

    return {
      searchText,
      filteredList,
      showDetailPopup,
      showEditPopup,
      currentCard,
      editForm,
      formatDate,
      handleAdd,
      handleClear,
      showDetail,
      showEdit,
      handleSave,
      handleDelete
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/_variables' as *;

.card-list {
  min-height: 100vh;
  background-color: $background-color;

  .search-bar {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .list-container {
    padding: $spacing-medium;

    .list-item {
      margin-bottom: $spacing-small;
      border-radius: $radius-large;
      overflow: hidden;

      .card-content {
        padding: $spacing-medium;
        background-color: #fff;

        .title {
          font-size: $font-size-medium;
          color: $text-primary;
          line-height: 1.4;
          margin-bottom: $spacing-small;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .info {
          font-size: $font-size-small;
          color: $text-secondary;
          display: flex;
          flex-wrap: wrap;
          gap: $spacing-small;
        }
      }

      .swipe-actions {
        height: 100%;
        display: flex;

        .van-button {
          height: 100%;
          width: 64px;
        }

        .edit-btn {
          background-color: $primary-color;
        }
      }
    }
  }
}

.detail-popup,
.edit-popup {
  max-height: 80vh;

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-medium;
    border-bottom: 1px solid #eee;

    .title {
      font-size: $font-size-medium;
      font-weight: 500;
      color: $text-primary;
    }

    .van-icon {
      font-size: 20px;
      color: $text-secondary;
    }
  }

  .popup-content {
    padding: $spacing-medium;
    overflow-y: auto;

    .section {
      margin-bottom: $spacing-large;

      &:last-child {
        margin-bottom: 0;
      }

      .section-title {
        font-size: $font-size-normal;
        color: $text-secondary;
        margin-bottom: $spacing-small;
      }

      .section-content {
        font-size: $font-size-medium;
        color: $text-primary;
        line-height: 1.6;
      }
    }

    .form {
      .form-item {
        margin-bottom: $spacing-large;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-size: $font-size-normal;
          color: $text-secondary;
          margin-bottom: $spacing-small;
        }

        .van-field {
          padding: 0;
          background-color: transparent;
        }
      }
    }
  }

  .popup-footer {
    padding: $spacing-medium;
    border-top: 1px solid #eee;
  }
}
</style> 