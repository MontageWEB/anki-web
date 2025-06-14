// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '未设置'
  try {
    // 处理日期字符串，移除可能存在的 +00:00Z 后缀
    const processedStr = dateStr.replace('+00:00Z', 'Z')
    const date = new Date(processedStr)
    
    if (isNaN(date.getTime())) {
      return '日期无效'
    }
    
    // 使用 Intl.DateTimeFormat 来格式化日期，这样可以正确处理时区
    const formatter = new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Shanghai'
    })
    
    return formatter.format(date)
  } catch (error) {
    console.error('日期格式化错误:', error)
    return '日期无效'
  }
}

<template>
  <div class="card-detail">
    <van-nav-bar
      title="卡片详情"
      left-arrow
      @click-left="onBack"
    />
    
    <div class="content">
      <div class="card">
        <div class="question">{{ card.title }}</div>
        <div class="answer">{{ card.answer }}</div>
      </div>
      
      <div class="info">
        <div class="info-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ formatDate(card.createdAt) }}</span>
        </div>
        <div class="info-item">
          <span class="label">更新时间：</span>
          <span class="value">{{ formatDate(card.updatedAt) }}</span>
        </div>
        <div class="info-item">
          <span class="label">复习次数：</span>
          <span class="value">{{ card.reviewCount }}</span>
        </div>
        <div class="info-item">
          <span class="label">下次复习：</span>
          <span class="value">{{ formatDate(card.nextReviewTime) }}</span>
        </div>
      </div>
      
      <div class="actions">
        <van-button type="primary" block @click="onEdit">编辑卡片</van-button>
      </div>
    </div>
  </div>
</template> 