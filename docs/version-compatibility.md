# 版本兼容性说明

## 核心依赖版本

- Vue: 3.4.19
- Vant: 4.9.19
- Vue Router: 4.3.0
- Pinia: 2.1.7

## Vant 4.x 重要变更

1. Toast 组件
   - ❌ 移除: `Toast.success()`, `Toast.fail()`, `Toast.loading()` 等静态方法
   - ✅ 新增: `showToast()`, `showLoadingToast()`, `showSuccessToast()`, `showFailToast()` 等函数
   ```js
   // 旧版用法（不支持）
   Toast.success('成功')
   
   // 新版用法
   showToast({
     type: 'success',
     message: '成功'
   })
   // 或者
   showSuccessToast('成功')
   ```

2. Dialog 组件
   - ❌ 移除: `Dialog.alert()`, `Dialog.confirm()` 等静态方法
   - ✅ 新增: `showDialog()`, `showConfirmDialog()` 等函数

3. Notify 组件
   - ❌ 移除: `Notify()` 静态方法
   - ✅ 新增: `showNotify()` 函数

## 版本升级注意事项

1. 依赖安装
   - 使用精确版本号，移除 `^` 符号
   - 每次安装依赖后检查 package-lock.json

2. 开发规范
   - 使用组件库提供的 TypeScript 类型
   - 参考官方文档的最新用法
   - 在开发新功能时检查 API 兼容性

3. 升级流程
   - 先在本地测试环境升级
   - 检查 CHANGELOG，关注破坏性变更
   - 编写升级测试用例
   - 逐步替换废弃的 API

## 常见问题解决

1. 组件 API 变更
   - 查看官方迁移指南
   - 使用新版 API 重构代码
   - 添加兼容性处理

2. 样式冲突
   - 使用 scoped 属性
   - 遵循 BEM 命名规范
   - 检查样式优先级

3. 版本冲突
   - 检查 peer dependencies
   - 统一依赖版本
   - 使用 yarn resolution 或 npm overrides

## 开发工具建议

1. VS Code 插件
   - Volar：Vue 3 支持
   - ESLint：代码检查
   - Prettier：代码格式化

2. 浏览器插件
   - Vue.js devtools：Vue 调试工具

3. 包管理器
   - 推荐使用 npm
   - 保持 package-lock.json 提交
   - 定期更新依赖检查 