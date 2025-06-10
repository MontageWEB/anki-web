/**
 * 格式化日期
 * @param {Date|string|number} date 日期对象/日期字符串/时间戳
 * @param {string} [format='YYYY-MM-DD'] 格式化模式
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date)
  
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()

  const padStart = (num) => String(num).padStart(2, '0')

  return format.replace(/Y{4}|M{2}|D{2}|h{2}|m{2}|s{2}/g, (match) => {
    switch (match) {
      case 'YYYY':
        return String(year)
      case 'MM':
        return padStart(month)
      case 'DD':
        return padStart(day)
      case 'hh':
        return padStart(hour)
      case 'mm':
        return padStart(minute)
      case 'ss':
        return padStart(second)
      default:
        return match
    }
  })
}

/**
 * 获取相对时间描述
 * @param {Date|string|number} date 日期对象/日期字符串/时间戳
 * @returns {string} 相对时间描述
 */
export function getRelativeTime(date) {
  const now = new Date()
  const target = new Date(date)
  const diff = now - target
  
  // 转换为秒
  const seconds = Math.floor(diff / 1000)
  
  if (seconds < 60) {
    return '刚刚'
  }
  
  // 转换为分钟
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}分钟前`
  }
  
  // 转换为小时
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}小时前`
  }
  
  // 转换为天
  const days = Math.floor(hours / 24)
  if (days < 30) {
    return `${days}天前`
  }
  
  // 转换为月
  const months = Math.floor(days / 30)
  if (months < 12) {
    return `${months}个月前`
  }
  
  // 转换为年
  const years = Math.floor(months / 12)
  return `${years}年前`
}

/**
 * 判断是否为同一天
 * @param {Date|string|number} date1 日期1
 * @param {Date|string|number} date2 日期2
 * @returns {boolean} 是否为同一天
 */
export function isSameDay(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

/**
 * 获取日期范围
 * @param {string} type 范围类型：'today' | 'week' | 'month' | 'year'
 * @returns {{start: Date, end: Date}} 日期范围
 */
export function getDateRange(type) {
  const now = new Date()
  const start = new Date(now)
  const end = new Date(now)
  
  switch (type) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
      
    case 'week':
      // 获取本周一和周日
      const day = start.getDay() || 7
      start.setDate(start.getDate() - day + 1)
      start.setHours(0, 0, 0, 0)
      end.setDate(end.getDate() + (7 - day))
      end.setHours(23, 59, 59, 999)
      break
      
    case 'month':
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(end.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)
      break
      
    case 'year':
      start.setMonth(0, 1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(11, 31)
      end.setHours(23, 59, 59, 999)
      break
  }
  
  return { start, end }
} 