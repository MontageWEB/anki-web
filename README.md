# Anki复习助手

基于 Vue 3.0 的移动端知识点复习应用，采用间隔重复算法帮助用户高效记忆和管理知识点。

## 技术栈

- 前端框架：Vue 3.0
- UI 框架：Ant Design Mobile
- 图标库：FontAwesome
- 状态管理：Pinia
- 路由：Vue Router
- HTTP 客户端：Axios
- 开发语言：原生 JavaScript（不使用 TypeScript）

## 项目设置

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

### 生产环境构建
```bash
npm run build
```

## 项目结构

```
anki-web/
├── docs/           # 文档
├── public/         # 静态资源
├── src/            # 源代码
│   ├── assets/     # 资源文件
│   ├── components/ # 组件
│   ├── views/      # 页面
│   ├── router/     # 路由
│   ├── store/      # 状态管理
│   ├── utils/      # 工具函数
│   └── App.vue     # 根组件
└── package.json    # 项目配置
```

## 开发规范

- 使用 Vue 3 组合式 API
- 采用原生 JavaScript 开发，不使用 TypeScript
- 遵循 ESLint 代码规范
- 组件化开发
- 移动端优先的响应式设计

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request 