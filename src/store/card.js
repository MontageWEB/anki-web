import { defineStore } from 'pinia'
import storage from '@/utils/storage'
import { showToast } from 'vant'

export const useCardStore = defineStore('card', {
  state: () => ({
    cards: [],
    loading: false,
    initialized: false
  }),

  getters: {
    // 获取所有卡片
    allCards: (state) => state.cards,

    // 获取今日需要复习的卡片
    todayReviewCards: (state) => {
      const now = new Date()
      return state.cards.filter(card => {
        const nextReviewTime = new Date(card.nextReviewTime)
        return nextReviewTime <= now
      })
    },

    // 获取卡片总数
    totalCount: (state) => state.cards.length,

    // 获取今日待复习数量
    todayReviewCount: (state) => {
      const now = new Date()
      return state.cards.filter(card => {
        const nextReviewTime = new Date(card.nextReviewTime)
        return nextReviewTime <= now
      }).length
    }
  },

  actions: {
    // 初始化卡片数据
    async initializeCards() {
      if (this.initialized) return
      
      this.loading = true
      try {
        const cards = await storage.getAllCards()
        this.cards = cards
        this.initialized = true
      } catch (error) {
        showToast('初始化卡片数据失败')
        console.error('初始化卡片数据失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 添加卡片
    async addCard(card) {
      this.loading = true
      try {
        const newCard = await storage.addCard(card)
        this.cards.push(newCard)
        showToast({
          type: 'success',
          message: '添加成功'
        })
        return newCard
      } catch (error) {
        showToast({
          type: 'fail',
          message: '添加失败'
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    // 更新卡片
    async updateCard(id, updates) {
      this.loading = true
      try {
        const updatedCard = await storage.updateCard(id, updates)
        const index = this.cards.findIndex(card => card.id === id)
        if (index !== -1) {
          this.cards[index] = updatedCard
        }
        showToast({
          type: 'success',
          message: '更新成功'
        })
        return updatedCard
      } catch (error) {
        showToast({
          type: 'fail',
          message: '更新失败'
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    // 删除卡片
    async deleteCard(id) {
      this.loading = true
      try {
        await storage.deleteCard(id)
        this.cards = this.cards.filter(card => card.id !== id)
        showToast({
          type: 'success',
          message: '删除成功'
        })
      } catch (error) {
        showToast({
          type: 'fail',
          message: '删除失败'
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    // 更新复习记录
    async updateReviewRecord(id, nextReviewTime) {
      this.loading = true
      try {
        const updatedCard = await storage.updateReviewRecord(id, nextReviewTime)
        const index = this.cards.findIndex(card => card.id === id)
        if (index !== -1) {
          this.cards[index] = updatedCard
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
    }
  }
}) 