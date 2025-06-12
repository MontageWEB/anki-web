# Anki复习助手

基于 Vue 3.0 的移动端知识点复习应用，采用间隔重复算法帮助用户高效记忆和管理知识点。
本项目是该产品的 Web 前端工程。

## 技术栈

- 前端框架：Vue 3.0
- 构建工具：Vite
- UI 框架：Vant 4 (https://vant-ui.github.io/vant)
- 样式预处理器：SCSS (Dart Sass 1.69.7)
- 状态管理：Pinia
- 路由：Vue Router
- HTTP 客户端：Axios
- 开发语言：原生 JavaScript（不使用 TypeScript）

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装和运行
```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 生产环境构建
npm run build
```

## 项目结构
```
src/
├── assets/     # 静态资源
├── components/ # 通用组件
├── views/      # 页面组件
├── router/     # 路由配置
├── store/      # 状态管理
├── styles/     # 全局样式
├── utils/      # 工具函数
└── App.vue     # 根组件
```

## 关键开发规范

### 代码规范
- 使用 ESLint + Prettier 进行代码格式化
- 使用 Vue 3 组合式 API 开发组件
- 组件和工具函数必须包含注释说明
- 所有依赖版本必须固定，禁止使用 ^ 或 ~

### 样式规范
- 使用 SCSS (Dart Sass 1.69.7) 作为预处理器
- 组件样式必须使用 scoped 属性
- 统一使用全局变量（_variables.scss）
- 遵循 BEM 命名规范

> 💡 详细的样式开发规范、最佳实践和常见问题解决方案请参考 `.cursorrules`。

### Git 规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 构建/工具相关

更多详细规范请参考项目根目录下的 `.cursorrules` 文件。

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request
