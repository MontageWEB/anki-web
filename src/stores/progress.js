import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import localforage from 'localforage'

export const useProgressStore = defineStore('progress', () => {
  // 状态
  const progress = ref({
    totalReviews: 0,
    correctReviews: 0,
    studyTime: 0, // 总学习时间（分钟）
    dailyStreak: 0, // 连续学习天数
    lastStudyDate: null,
    dailyStats: {}, // 每日统计数据
  })
  const isLoading = ref(false)
  const error = ref(null)

  // 计算属性
  const accuracy = computed(() => {
    if (progress.value.totalReviews === 0) return 0
    return (progress.value.correctReviews / progress.value.totalReviews) * 100
  })

  // 动作
  const initializeProgress = async () => {
    isLoading.value = true
    try {
      const storedProgress = await localforage.getItem('progress')
      if (storedProgress) {
        progress.value = storedProgress
      }
      updateStreak()
    } catch (e) {
      error.value = '加载进度数据失败'
      console.error('Failed to load progress:', e)
    } finally {
      isLoading.value = false
    }
  }

  const updateProgress = async (updates) => {
    try {
      progress.value = { ...progress.value, ...updates }
      await saveProgress()
    } catch (e) {
      error.value = '更新进度失败'
      console.error('Failed to update progress:', e)
      throw e
    }
  }

  const recordReview = async (isCorrect) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // 更新总统计
      progress.value.totalReviews++
      if (isCorrect) {
        progress.value.correctReviews++
      }

      // 更新每日统计
      if (!progress.value.dailyStats[today]) {
        progress.value.dailyStats[today] = {
          reviews: 0,
          correct: 0,
          studyTime: 0,
        }
      }
      progress.value.dailyStats[today].reviews++
      if (isCorrect) {
        progress.value.dailyStats[today].correct++
      }

      await saveProgress()
    } catch (e) {
      error.value = '记录复习结果失败'
      console.error('Failed to record review:', e)
      throw e
    }
  }

  const updateStreak = () => {
    const today = new Date().setHours(0, 0, 0, 0)
    const lastStudy = progress.value.lastStudyDate ? 
      new Date(progress.value.lastStudyDate).setHours(0, 0, 0, 0) : null

    if (!lastStudy) {
      progress.value.dailyStreak = 0
      return
    }

    const dayDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24))
    if (dayDiff > 1) {
      progress.value.dailyStreak = 0
    } else if (dayDiff === 1) {
      progress.value.dailyStreak++
    }
  }

  const saveProgress = async () => {
    try {
      await localforage.setItem('progress', progress.value)
    } catch (e) {
      error.value = '保存进度数据失败'
      console.error('Failed to save progress:', e)
      throw e
    }
  }

  // 初始化
  initializeProgress()

  return {
    progress,
    isLoading,
    error,
    accuracy,
    recordReview,
    updateProgress,
    initializeProgress
  }
}) 