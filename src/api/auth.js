import request from '@/utils/request'

/**
 * 微信一键登录
 * @param {Object} data { code, nickname, avatar }
 * @returns {Promise<{access_token: string, token_type: string}>}
 */
export function wxLogin(data) {
  return request({
    url: '/api/v1/auth/wx-login',
    method: 'post',
    data
  })
}
