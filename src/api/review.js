import request from '@/utils/request'

/**
 * 获取复习规则列表
 * @returns {Promise<{items: Array<{id: number, review_count: number, interval_days: number, created_at: string, updated_at: string}>}>}
 */
export function getReviewRules() {
  return request({
    url: '/api/v1/review-rules/',
    method: 'get'
  })
}

/**
 * 批量更新复习规则
 * @param {Object} data - { rules: Array<{review_count: number, interval_days: number}> }
 * @returns {Promise<{items: Array}>}
 */
export function updateReviewRules(data) {
  return request({
    url: '/api/v1/review-rules/',
    method: 'put',
    data
  })
}

/**
 * 重置复习规则为默认值
 * @returns {Promise<{items: Array}>}
 */
export function resetReviewRules() {
  return request({
    url: '/api/v1/review-rules/reset/',
    method: 'post'
  })
} 