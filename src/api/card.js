import request from '@/utils/request'

/**
 * 将后端卡片数据转换为前端格式
 * @param {Object} card 后端卡片数据
 * @returns {Object} 前端卡片数据
 */
function transformCard(card) {
  return {
    id: card.id,
    title: card.question,
    answer: card.answer,
    nextReviewTime: card.next_review_at,
    reviewCount: card.review_count,
    createdAt: card.created_at,
    updatedAt: card.updated_at
  }
}

/**
 * 将前端卡片数据转换为后端格式
 * @param {Object} card 前端卡片数据
 * @returns {Object} 后端卡片数据
 */
function transformCardToBackend(card) {
  return {
    question: card.title,
    answer: card.answer
  }
}

/**
 * 获取卡片列表
 * @param {Object} params 查询参数
 * @param {number} params.page 页码，默认 1
 * @param {number} params.per_page 每页数量，默认 20
 * @param {string} params.search 搜索关键词（可选）
 * @returns {Promise<Object>} 卡片列表数据，包含分页信息
 */
export function getCardList(params = {}) {
  return request({
    url: '/api/v1/cards',
    method: 'get',
    params: {
      page: params.page || 1,
      per_page: params.per_page || 20,
      search: params.search
    }
  }).then(response => ({
    total: response.total,
    page: response.page,
    per_page: response.per_page,
    items: response.items.map(transformCard)
  }))
}

/**
 * 创建新卡片
 * @param {Object} data 卡片数据
 * @param {string} data.title 知识点
 * @param {string} data.answer 答案
 * @returns {Promise<Object>} 创建的卡片数据
 */
export function createCard(data) {
  return request({
    url: '/api/v1/cards',
    method: 'post',
    data: transformCardToBackend(data)
  }).then(transformCard)
}

/**
 * 更新卡片
 * @param {string} id 卡片ID
 * @param {Object} data 更新的数据
 * @returns {Promise<Object>} 更新后的卡片数据
 */
export function updateCard(id, data) {
  return request({
    url: `/api/v1/cards/${id}`,
    method: 'put',
    data: transformCardToBackend(data)
  }).then(transformCard)
}

/**
 * 删除卡片
 * @param {string} id 卡片ID
 * @returns {Promise<void>}
 */
export function deleteCard(id) {
  return request({
    url: `/api/v1/cards/${id}`,
    method: 'delete'
  })
}

/**
 * 获取今日待复习卡片
 * @returns {Promise<Array>} 今日待复习的卡片列表
 */
export function getTodayCards() {
  return request({
    url: '/api/v1/cards/review',
    method: 'get'
  }).then(response => ({
    total: response.total,
    page: response.page,
    per_page: response.per_page,
    items: response.items.map(transformCard)
  }))
} 