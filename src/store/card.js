import { defineStore } from 'pinia'
import { getCardList, createCard, updateCard, deleteCard, getTodayCards, getCardDetail, updateNextReviewTime } from '@/api/card'
import { showToast } from 'vant'

export const useCardStore = defineStore('card', {
  state: () => ({
    allCards: [],
    todayCards: [],
    loading: false,
    initialized: false,
    // 添加分页相关状态
    pagination: {
      total: 0,
      page: 1,
      per_page: 20
    },
    // 搜索关键词
    searchText: ''
  }),

  getters: {
    // 获取今日需要复习的卡片
    todayReviewCards: (state) => {
      const now = new Date()
      return state.todayCards.filter(card => {
        const nextReviewTime = new Date(card.nextReviewTime)
        return nextReviewTime <= now
      })
    },

    // 获取卡片总数
    totalCount: (state) => state.allCards.length,

    // 获取今日待复习数量
    todayReviewCount: (state) => {
      const now = new Date()
      return state.todayCards.filter(card => {
        const nextReviewTime = new Date(card.nextReviewTime)
        return nextReviewTime <= now
      }).length
    },

    // 根据搜索文本过滤卡片
    filteredCards: (state) => (searchText) => {
      if (!searchText) return state.allCards
      const lowerSearchText = searchText.toLowerCase()
      return state.allCards.filter(card => 
        card.title.toLowerCase().includes(lowerSearchText) ||
        card.answer.toLowerCase().includes(lowerSearchText)
      )
    },

    // 获取分页信息
    paginationInfo: (state) => state.pagination
  },

  actions: {
    // 初始化卡片列表
    async initializeCards(params = {}) {
      if (this.loading) return
      
      this.loading = true
      try {
        const response = await getCardList({
          page: params.page || this.pagination.page,
          per_page: params.per_page || this.pagination.per_page,
          search: params.search || this.searchText
        })

        // 更新卡片列表和分页信息
        this.allCards = response.items
        this.pagination = {
          total: response.total,
          page: response.page,
          per_page: response.per_page
        }
        this.initialized = true
      } catch (error) {
        console.error('获取卡片列表失败:', error)
        showToast('获取卡片列表失败')
      } finally {
        this.loading = false
      }
    },

    // 设置搜索关键词并重新加载列表
    async setSearchText(text) {
      this.searchText = text
      await this.initializeCards({ page: 1, search: text })
    },

    // 切换页码
    async setPage(page) {
      await this.initializeCards({ page })
    },

    // 获取今日待复习卡片
    async fetchTodayCards() {
      if (this.loading) return
      
      this.loading = true
      try {
        const cards = await getTodayCards()
        this.todayCards = cards.map(card => ({
          ...card,
          isFlipped: false
        }))
      } catch (error) {
        console.error('获取今日卡片失败:', error)
        showToast('获取今日卡片失败')
      } finally {
        this.loading = false
      }
    },

    // 创建新卡片
    async createCard(cardData) {
      try {
        const newCard = await createCard(cardData)
        this.allCards.unshift(newCard)
        showToast({
          type: 'success',
          message: '创建成功'
        })
        return newCard
      } catch (error) {
        console.error('创建卡片失败:', error)
        throw error
      }
    },

    // 更新卡片
    async updateCard(id, data) {
      try {
        const updatedCard = await updateCard(id, data)
        const index = this.allCards.findIndex(card => card.id === id)
        if (index !== -1) {
          this.allCards[index] = updatedCard
        }
        
        // 如果卡片在今日列表中，也需要更新
        const todayIndex = this.todayCards.findIndex(card => card.id === id)
        if (todayIndex !== -1) {
          this.todayCards[todayIndex] = {
            ...updatedCard,
            isFlipped: this.todayCards[todayIndex].isFlipped
          }
        }
        
        return updatedCard
      } catch (error) {
        console.error('更新卡片失败:', error)
        throw error
      }
    },

    // 删除卡片
    async deleteCard(id) {
      try {
        await deleteCard(id)
        this.allCards = this.allCards.filter(card => card.id !== id)
        this.todayCards = this.todayCards.filter(card => card.id !== id)
        showToast({
          type: 'success',
          message: '删除成功'
        })
      } catch (error) {
        console.error('删除卡片失败:', error)
        throw error
      }
    },

    // 更新复习记录
    async updateReviewRecord(id, nextReviewTime) {
      this.loading = true
      try {
        const updatedCard = await storage.updateReviewRecord(id, nextReviewTime)
        const index = this.allCards.findIndex(card => card.id === id)
        if (index !== -1) {
          this.allCards[index] = updatedCard
        }
        return updatedCard
      } catch (error) {
        showToast({
          type: 'fail',
          message: '更新复习记录失败'
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取卡片详情
    async getCardDetail(id) {
      if (this.loading) return
      
      this.loading = true
      try {
        const card = await getCardDetail(id)
        return card
      } catch (error) {
        console.error('获取卡片详情失败:', error)
        showToast('获取卡片详情失败')
        throw error
      } finally {
        this.loading = false
      }
    },

    // 修改下次复习时间
    async updateNextReviewTime(id, nextReviewAt) {
      if (this.loading) return
      
      this.loading = true
      try {
        const updatedCard = await updateNextReviewTime(id, nextReviewAt)
        
        // 更新 allCards 中的卡片
        const index = this.allCards.findIndex(card => card.id === id)
        if (index !== -1) {
          this.allCards[index] = updatedCard
        }
        
        // 更新 todayCards 中的卡片
        const todayIndex = this.todayCards.findIndex(card => card.id === id)
        if (todayIndex !== -1) {
          // 如果新的复习时间超过今天，从今日复习列表中移除
          const today = new Date()
          today.setHours(23, 59, 59, 999)
          
          if (new Date(nextReviewAt) > today) {
            this.todayCards.splice(todayIndex, 1)
          } else {
            this.todayCards[todayIndex] = updatedCard
          }
        }
        
        return updatedCard
      } catch (error) {
        console.error('修改下次复习时间失败:', error)
        showToast('修改下次复习时间失败')
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 