# Anki复习助手

基于 Vue 3.0 的移动端知识点复习应用，采用间隔重复算法帮助用户高效记忆和管理知识点。

## 技术栈

- 前端框架：Vue 3.0
- 构建工具：Vite
- UI 框架：Vant (https://vant-ui.github.io/vant)
- 样式预处理器：SCSS (Dart Sass)
- 状态管理：Pinia
- 路由：Vue Router
- HTTP 客户端：Axios
- 开发语言：原生 JavaScript（不使用 TypeScript）

## 项目设置

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖
```bash
# 安装基础依赖
npm install

# 安装核心功能依赖
npm install vue-router@4
npm install pinia
npm install vant
npm install axios
npm install lodash-es
npm install localforage

# 安装开发依赖
npm install sass --save-dev
npm install eslint --save-dev
npm install prettier --save-dev
```

### 开发环境运行
```bash
npm run dev
```

### 生产环境构建
```bash
npm run build
npm run preview  # 预览构建结果
```

## 项目结构

```
anki-web/
├── docs/           # 文档
├── public/         # 静态资源
├── src/            # 源代码
│   ├── assets/     # 资源文件
│   ├── components/ # 组件
│   │   ├── common/ # 基础组件
│   │   └── business/ # 业务组件
│   ├── views/      # 页面
│   ├── router/     # 路由
│   ├── store/      # 状态管理
│   ├── styles/     # 全局样式
│   │   ├── _variables.scss # 变量定义
│   │   └── index.scss     # 样式入口
│   ├── utils/      # 工具函数
│   └── App.vue     # 根组件
└── package.json    # 项目配置
```

## 开发规范

### Vue 开发规范
- 使用 Vue 3 组合式 API
- 采用原生 JavaScript 开发，不使用 TypeScript
- 遵循 ESLint 代码规范
- 组件化开发

### 样式开发规范
- 使用 SCSS 预处理器（Dart Sass）
- 使用新的 SCSS 模块系统：
  - 严格使用 @use 语法，禁止使用 @import
  - 变量文件使用下划线前缀（_variables.scss）
  - 禁止在变量文件中使用 @forward 自引用
  - 组件中统一使用 @use '@/styles/_variables' as *
- 遵循 BEM 命名规范
- 使用全局变量进行主题定制
- 移动端优先的响应式设计

### 目录结构说明
```
src/styles/
├── _variables.scss   # 全局变量定义（注意下划线前缀）
└── index.scss        # 全局样式入口（引入变量）

组件目录/
└── Component.vue     # 组件样式使用 scoped + @use 引入变量
```

### 样式使用示例
```vue
<!-- 组件中的样式 -->
<style lang="scss" scoped>
@use '@/styles/_variables' as *;

.component {
  color: $primary-color;
  padding: $spacing-medium;
}
</style>
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request
