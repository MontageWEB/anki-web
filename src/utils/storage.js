import localforage from 'localforage'

// 初始化 localforage
localforage.config({
  name: 'anki-web',
  storeName: 'cards'
})

/**
 * 本地存储服务
 */
class StorageService {
  /**
   * 获取所有卡片
   * @returns {Promise<Array>} 卡片列表
   */
  async getAllCards() {
    try {
      const cards = await localforage.getItem('cards')
      return cards || []
    } catch (error) {
      console.error('获取卡片失败:', error)
      return []
    }
  }

  /**
   * 保存所有卡片
   * @param {Array} cards 卡片列表
   * @returns {Promise<void>}
   */
  async saveCards(cards) {
    try {
      await localforage.setItem('cards', cards)
    } catch (error) {
      console.error('保存卡片失败:', error)
      throw error
    }
  }

  /**
   * 添加卡片
   * @param {Object} card 卡片对象
   * @returns {Promise<Object>} 添加后的卡片
   */
  async addCard(card) {
    try {
      const cards = await this.getAllCards()
      const now = new Date()
      const today = new Date(now)
      today.setHours(23, 59, 59, 999)  // 设置为今天的 23:59:59.999
      
      const newCard = {
        ...card,
        id: Date.now().toString(),
        createTime: now.toISOString(),
        updateTime: now.toISOString(),
        reviewCount: 0,
        nextReviewTime: today.toISOString()
      }
      cards.push(newCard)
      await this.saveCards(cards)
      return newCard
    } catch (error) {
      console.error('添加卡片失败:', error)
      throw error
    }
  }

  /**
   * 更新卡片
   * @param {string} id 卡片ID
   * @param {Object} updates 更新内容
   * @returns {Promise<Object>} 更新后的卡片
   */
  async updateCard(id, updates) {
    try {
      const cards = await this.getAllCards()
      const index = cards.findIndex(card => card.id === id)
      if (index === -1) {
        throw new Error('卡片不存在')
      }
      const updatedCard = {
        ...cards[index],
        ...updates,
        updateTime: new Date().toISOString()
      }
      cards[index] = updatedCard
      await this.saveCards(cards)
      return updatedCard
    } catch (error) {
      console.error('更新卡片失败:', error)
      throw error
    }
  }

  /**
   * 删除卡片
   * @param {string} id 卡片ID
   * @returns {Promise<void>}
   */
  async deleteCard(id) {
    try {
      const cards = await this.getAllCards()
      const filteredCards = cards.filter(card => card.id !== id)
      await this.saveCards(filteredCards)
    } catch (error) {
      console.error('删除卡片失败:', error)
      throw error
    }
  }

  /**
   * 更新复习记录
   * @param {string} id 卡片ID
   * @param {Date} nextReviewTime 下次复习时间
   * @returns {Promise<Object>} 更新后的卡片
   */
  async updateReviewRecord(id, nextReviewTime) {
    try {
      const cards = await this.getAllCards()
      const index = cards.findIndex(card => card.id === id)
      if (index === -1) {
        throw new Error('卡片不存在')
      }
      const updatedCard = {
        ...cards[index],
        reviewCount: cards[index].reviewCount + 1,
        lastReviewTime: new Date().toISOString(),
        nextReviewTime: nextReviewTime.toISOString(),
        updateTime: new Date().toISOString()
      }
      cards[index] = updatedCard
      await this.saveCards(cards)
      return updatedCard
    } catch (error) {
      console.error('更新复习记录失败:', error)
      throw error
    }
  }
}

export default new StorageService() 