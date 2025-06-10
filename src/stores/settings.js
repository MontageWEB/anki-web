import { defineStore } from 'pinia'
import { ref } from 'vue'
import localforage from 'localforage'

export const useSettingsStore = defineStore('settings', () => {
  // 状态
  const settings = ref({
    dailyNewCards: 20, // 每日新卡片数量
    dailyReviewCards: 100, // 每日复习卡片数量
    intervalModifier: 1, // 间隔修正因子
    easyBonus: 1.3, // 简单奖励系数
    startingEase: 2.5, // 初始简易度
  })
  const isLoading = ref(false)
  const error = ref(null)

  // 动作
  const initializeSettings = async () => {
    isLoading.value = true
    try {
      const storedSettings = await localforage.getItem('settings')
      if (storedSettings) {
        settings.value = { ...settings.value, ...storedSettings }
      }
    } catch (e) {
      error.value = '加载设置失败'
      console.error('Failed to load settings:', e)
    } finally {
      isLoading.value = false
    }
  }

  const updateSettings = async (newSettings) => {
    try {
      settings.value = { ...settings.value, ...newSettings }
      await localforage.setItem('settings', settings.value)
    } catch (e) {
      error.value = '保存设置失败'
      console.error('Failed to save settings:', e)
      throw e
    }
  }

  const resetSettings = async () => {
    try {
      settings.value = {
        dailyNewCards: 20,
        dailyReviewCards: 100,
        intervalModifier: 1,
        easyBonus: 1.3,
        startingEase: 2.5,
      }
      await localforage.setItem('settings', settings.value)
    } catch (e) {
      error.value = '重置设置失败'
      console.error('Failed to reset settings:', e)
      throw e
    }
  }

  // 初始化
  initializeSettings()

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    resetSettings,
    initializeSettings
  }
}) 