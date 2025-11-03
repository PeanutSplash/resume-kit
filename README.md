# Resume Kit

> 一个基于 Web Components 的通用简历组件库，适用于 React、Vue、Svelte 和原生 JavaScript

[![npm version](https://img.shields.io/npm/v/resume-kit.svg)](https://www.npmjs.com/package/resume-kit)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ 特性

- 🎨 **多种模板** - 提供经典、现代、时间轴等多种简历模板
- 🔧 **高度可定制** - 支持自定义主题色、字体、间距等全局样式
- 📱 **响应式设计** - 基于 Tailwind CSS，完美适配各种屏幕尺寸
- 🌐 **框架无关** - 基于 Web Components，可在任何前端框架中使用
- 💪 **TypeScript 支持** - 完整的类型定义，提供出色的开发体验
- 🎯 **模块化设计** - 每个部分都是独立组件，可按需使用
- 🚀 **轻量高效** - 基于 Lit 构建，体积小、性能优

## 📦 安装

通过 npm、pnpm 或 yarn 安装：

- `npm install resume-kit`
- `pnpm add resume-kit`
- `yarn add resume-kit`

## 🚀 快速开始

Resume Kit 可以在任何前端框架中使用：

1. **导入组件库**：`import 'resume-kit/dist/index.js'`
2. **导入类型和工具**：`import { createInitialResumeData, type ResumeData } from 'resume-kit'`
3. **使用 Web Components**：在 HTML 中直接使用 `<rk-resume-preview>` 等组件

支持在以下环境中使用：
- ⚛️ React / Next.js
- 💚 Vue 3 / Nuxt 3
- 🔥 Svelte / SvelteKit
- 📄 原生 JavaScript / HTML

详细的使用示例和代码请查看 [API.md](./API.md)

## 📚 核心组件

### `<rk-resume-preview>`

主简历预览组件，整合所有子组件

- **属性**:
  - `value`: 简历数据对象（ResumeData）
  - `template-id`: 模板类型（'classic' | 'modern' | 'timeline'）

### `<rk-base-info>`

基本信息组件，展示姓名、联系方式等

- **属性**:
  - `data`: 基本信息对象（BasicInfo）
  - `globalSettings`: 全局样式设置
  - `template-id`: 模板类型

### `<rk-experience-section>`

工作经验模块

- **属性**:
  - `data`: 工作经验数组（Experience[]）
  - `globalSettings`: 全局样式设置
  - `show-title`: 是否显示标题

### `<rk-education-section>`

教育背景模块

- **属性**:
  - `data`: 教育背景数组（Education[]）
  - `globalSettings`: 全局样式设置
  - `show-title`: 是否显示标题

### `<rk-project-section>`

项目经验模块

- **属性**:
  - `data`: 项目列表（Project[]）
  - `globalSettings`: 全局样式设置
  - `show-title`: 是否显示标题

### `<rk-skill-section>`

技能模块

- **属性**:
  - `data`: 技能内容（字符串）
  - `globalSettings`: 全局样式设置
  - `show-title`: 是否显示标题

### `<rk-custom-section>`

自定义模块，可用于添加其他内容

- **属性**:
  - `section-id`: 模块 ID
  - `title`: 模块标题
  - `items`: 自定义项目列表
  - `globalSettings`: 全局样式设置

## 🎨 模板样式

Resume Kit 提供三种内置模板：

- **Classic（经典）** - 传统的单栏布局，内容从上到下依次排列，适合大多数场景
- **Modern（现代）** - 左右分栏布局，左侧显示基本信息，右侧显示其他内容，现代感十足
- **Timeline（时间轴）** - 时间轴风格布局，适合强调时间顺序和发展历程

通过 `template-id` 属性切换模板：`'classic'`、`'modern'`、`'timeline'`

## ⚙️ 全局样式配置

通过 `GlobalSettings` 对象可以自定义简历的整体样式，支持以下配置项：

- `themeColor` - 主题色
- `fontFamily` - 字体
- `baseFontSize` - 基础字号
- `pagePadding` - 页面内边距
- `paragraphSpacing` - 段落间距
- `lineHeight` - 行高
- `sectionSpacing` - 模块间距
- `headerSize` - 标题字号
- `subheaderSize` - 副标题字号
- `useIconMode` - 是否使用图标模式
- `centerSubtitle` - 副标题是否居中

## 🔧 工具函数

### `createInitialResumeData(options)`

创建初始化的简历数据对象，支持传入初始配置参数（标题、基本信息、教育背景、工作经验、项目经验、技能、全局设置等）。

### `generateId(prefix)`

生成带前缀的唯一 ID，用于创建各种数据项的唯一标识。

## 📖 类型定义

Resume Kit 导出了完整的 TypeScript 类型定义，包括：

`ResumeData`, `BasicInfo`, `Education`, `Experience`, `Project`, `Skill`, `CustomItem`, `GlobalSettings`, `MenuSection`, `PhotoConfig` 等

详细的类型定义和 API 文档请查看 [API.md](./API.md)

## 🎯 使用场景

- 📄 **在线简历生成器** - 构建可视化简历编辑器
- 🖨️ **简历打印服务** - 生成可打印的简历文档
- 💼 **招聘平台** - 统一的简历展示格式
- 👤 **个人网站** - 在个人网站上展示简历
- 📱 **移动应用** - 在混合应用中展示简历

## 🛠️ 开发

克隆项目后，使用以下命令：

- `pnpm install` - 安装依赖
- `pnpm dev` - 开发模式（监听文件变化）
- `pnpm build` - 构建生产版本
- `pnpm clean` - 清理构建产物

## 📝 许可证

MIT License

**项目来源说明**：This project is a derivative of Magic Resume (Apache 2.0 with additional commercial terms). Licensed under MIT with attribution to the original authors.

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/PeanutSplash/resume-kit/issues)

---

Made with ❤️ by Resume Kit Team

