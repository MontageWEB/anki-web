import request from '@/utils/request'

/**
 * 将后端卡片数据转换为前端格式
 * @param {Object} card 后端卡片数据
 * @returns {Object} 前端卡片数据
 */
function transformCard(card) {
  console.log('原始卡片数据:', card)
  
  // 处理日期字段
  const processDate = (dateStr) => {
    if (!dateStr) return null
    try {
      // 处理日期字符串，移除可能存在的 +00:00Z 后缀
      const processedStr = dateStr.replace('+00:00Z', 'Z')
      const date = new Date(processedStr)
      return !isNaN(date.getTime()) ? processedStr : null
    } catch (error) {
      console.error('日期转换错误:', error)
      return null
    }
  }
  
  // 检查 next_review_at 是否有效
  let nextReviewTime = processDate(card.next_review_at)
  console.log('处理后的 nextReviewTime:', nextReviewTime)
  
  // 处理创建时间和更新时间
  const createdAt = processDate(card.created_at)
  const updatedAt = processDate(card.updated_at)
  console.log('处理后的 createdAt:', createdAt)
  console.log('处理后的 updatedAt:', updatedAt)

  const transformedCard = {
    id: card.id,
    title: card.question,
    answer: card.answer,
    nextReviewTime,
    reviewCount: card.review_count || 0,
    createdAt,
    updatedAt
  }
  
  console.log('转换后的卡片数据:', transformedCard)
  return transformedCard
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
 * @param {string} [params.search] 搜索关键词
 * @returns {Promise<Object>} 卡片列表数据
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
 * @param {Object} params 查询参数
 * @param {number} params.page 页码，默认 1
 * @param {number} params.per_page 每页数量，默认 20
 * @returns {Promise<Object>} 今日待复习的卡片列表
 */
export function getTodayCards(params = {}) {
  return request({
    url: '/api/v1/cards/review',
    method: 'get',
    params: {
      page: params.page || 1,
      per_page: params.per_page || 20
    }
  }).then(response => ({
    total: response.total,
    page: response.page,
    per_page: response.per_page,
    items: response.items.map(transformCard)
  }))
}

/**
 * 获取卡片详情
 * @param {string} id 卡片ID
 * @returns {Promise<Object>} 卡片详情数据
 */
export function getCardDetail(id) {
  return request({
    url: `/api/v1/cards/${id}`,
    method: 'get'
  }).then(transformCard)
}

/**
 * 修改卡片下次复习时间
 * @param {string} id 卡片ID
 * @param {string} nextReviewAt ISO 8601格式的日期时间
 * @returns {Promise<Object>} 更新后的卡片
 */
export function updateNextReviewTime(id, nextReviewAt) {
  return request({
    url: `/api/v1/cards/${id}/next-review`,
    method: 'put',
    data: {
      next_review_at: nextReviewAt
    }
  }).then(transformCard)
}

/**
 * 更新卡片复习状态
 * @param {string} id 卡片ID
 * @param {boolean} remembered 是否记住
 * @returns {Promise<Object>} 更新后的卡片
 */
export function updateReviewStatus(id, remembered) {
  return request({
    url: `/api/v1/cards/${id}/review`,
    method: 'post',
    data: {
      remembered
    }
  }).then(transformCard)
} 