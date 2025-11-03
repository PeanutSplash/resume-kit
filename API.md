# Resume Kit API 文档

本文档详细介绍了 Resume Kit 的所有组件、类型定义和工具函数。

## 目录

- [Web Components](#web-components)
  - [rk-resume-preview](#rk-resume-preview)
  - [rk-base-info](#rk-base-info)
  - [rk-experience-section](#rk-experience-section)
  - [rk-education-section](#rk-education-section)
  - [rk-project-section](#rk-project-section)
  - [rk-skill-section](#rk-skill-section)
  - [rk-custom-section](#rk-custom-section)
  - [rk-section-title](#rk-section-title)
  - [rk-icon](#rk-icon)
- [TypeScript 类型](#typescript-类型)
- [工具函数](#工具函数)
- [常量](#常量)

---

## Web Components

### `<rk-resume-preview>`

简历预览主组件，负责整合和渲染所有子模块。

#### 属性 (Properties)

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| `value` | `ResumeData` | - | ✅ | 完整的简历数据对象 |
| `template-id` | `'classic' \| 'modern' \| 'timeline'` | `'classic'` | ❌ | 简历模板类型 |

#### 模板类型说明

- **classic**: 经典单栏布局，从上到下依次展示各个模块
- **modern**: 现代双栏布局，左侧显示基本信息（深色背景），右侧显示其他内容
- **timeline**: 时间轴布局，使用时间线样式展示各个模块

#### 使用示例

```typescript
import { createInitialResumeData } from '@resume-kit'
import type { ResumeData } from '@resume-kit'

const resumeData: ResumeData = createInitialResumeData({
  title: '我的简历'
})
```

```html
<rk-resume-preview 
  .value="${resumeData}" 
  template-id="modern"
></rk-resume-preview>
```

#### 内部实现

- 根据 `value.menuSections` 的 `enabled` 和 `order` 属性动态渲染模块
- 自动应用 `globalSettings` 中的样式配置
- 支持自定义模块的渲染

---

### `<rk-base-info>`

基本信息组件，展示个人基础信息。

#### 属性 (Properties)

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| `data` | `BasicInfo` | - | ✅ | 基本信息数据对象 |
| `globalSettings` | `GlobalSettings` | `undefined` | ❌ | 全局样式设置 |
| `template-id` | `'classic' \| 'modern' \| 'timeline'` | `'classic'` | ❌ | 模板类型 |

#### 功能特性

- **布局模式**: 支持左对齐、右对齐、居中三种布局（通过 `data.layout` 控制）
- **照片展示**: 支持自定义照片尺寸和圆角（通过 `data.photoConfig` 控制）
- **字段排序**: 可自定义字段显示顺序（通过 `data.fieldOrder` 控制）
- **图标模式**: 支持图标+文本或纯文本两种展示方式（通过 `globalSettings.useIconMode` 控制）
- **自定义字段**: 支持添加自定义联系方式（通过 `data.customFields` 添加）

#### 使用示例

```typescript
const basicInfo: BasicInfo = {
  name: '张三',
  title: '前端工程师',
  email: 'zhangsan@example.com',
  phone: '138-0000-0000',
  location: '北京市海淀区',
  birthDate: '1995-01-01',
  employementStatus: '在职',
  website: 'https://zhangsan.com',
  photo: 'https://example.com/photo.jpg',
  photoConfig: {
    width: 90,
    height: 120,
    aspectRatio: '1:1',
    borderRadius: 'full',
    customBorderRadius: 0,
    visible: true
  },
  icons: {
    email: 'Mail',
    phone: 'Phone',
    location: 'MapPin',
    website: 'Globe'
  },
  layout: 'left',
  customFields: [
    {
      id: 'custom_1',
      label: '微信',
      value: 'zhangsan-wx',
      icon: 'MessageCircle',
      visible: true
    }
  ],
  fieldOrder: [
    { id: '1', key: 'name', label: '姓名', type: 'text', visible: true },
    { id: '2', key: 'title', label: '职位', type: 'text', visible: true },
    { id: '3', key: 'email', label: '邮箱', type: 'text', visible: true },
    { id: '4', key: 'phone', label: '电话', type: 'text', visible: true },
    { id: '5', key: 'location', label: '地址', type: 'text', visible: true }
  ],
  githubKey: '',
  githubUseName: '',
  githubContributionsVisible: false
}
```

```html
<rk-base-info 
  .data="${basicInfo}"
  .globalSettings="${globalSettings}"
  template-id="classic"
></rk-base-info>
```

---

### `<rk-experience-section>`

工作经验模块组件。

#### 属性 (Properties)

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| `data` | `Experience[]` | - | ✅ | 工作经验数组 |
| `globalSettings` | `GlobalSettings` | `undefined` | ❌ | 全局样式设置 |
| `template-id` | `'classic' \| 'modern' \| 'timeline'` | `'classic'` | ❌ | 模板类型 |
| `show-title` | `boolean` | `true` | ❌ | 是否显示"工作经验"标题 |

#### 使用示例

```typescript
const experience: Experience[] = [
  {
    id: 'exp_1',
    company: 'ABC科技公司',
    position: '高级前端工程师',
    date: '2020.06 - 至今',
    details: '负责公司核心产品的前端开发，使用 React、TypeScript 构建复杂的单页应用。',
    visible: true
  },
  {
    id: 'exp_2',
    company: 'XYZ互联网公司',
    position: '前端工程师',
    date: '2018.07 - 2020.05',
    details: '参与多个项目的前端开发，熟练使用 Vue.js、Webpack 等技术栈。',
    visible: true
  }
]
```

```html
<rk-experience-section 
  .data="${experience}"
  .globalSettings="${globalSettings}"
  show-title
></rk-experience-section>
```

---

### `<rk-education-section>`

教育背景模块组件。

#### 属性 (Properties)

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| `data` | `Education[]` | - | ✅ | 教育背景数组 |
| `globalSettings` | `GlobalSettings` | `undefined` | ❌ | 全局样式设置 |
| `template-id` | `'classic' \| 'modern' \| 'timeline'` | `'classic'` | ❌ | 模板类型 |
| `show-title` | `boolean` | `true` | ❌ | 是否显示"教育背景"标题 |

#### 使用示例

```typescript
const education: Education[] = [
  {
    id: 'edu_1',
    school: '清华大学',
    major: '计算机科学与技术',
    degree: '本科',
    startDate: '2014-09',
    endDate: '2018-06',
    gpa: '3.8/4.0',
    description: '主修课程：数据结构、算法、操作系统、计算机网络等',
    visible: true
  }
]
```

```html
<rk-education-section 
  .data="${education}"
  .globalSettings="${globalSettings}"
  show-title
></rk-education-section>
```

---

### `<rk-project-section>`

项目经验模块组件。

#### 属性 (Properties)

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| `data` | `Project[]` | - | ✅ | 项目列表 |
| `globalSettings` | `GlobalSettings` | `undefined` | ❌ | 全局样式设置 |
| `template-id` | `'classic' \| 'modern' \| 'timeline'` | `'classic'` | ❌ | 模板类型 |
| `show-title` | `boolean` | `true` | ❌ | 是否显示"项目经验"标题 |

#### 使用示例

```typescript
const projects: Project[] = [
  {
    id: 'proj_1',
    name: '电商管理平台',
    role: '前端负责人',
    date: '2022.01 - 2022.12',
    description: '使用 React + TypeScript + Ant Design 构建的企业级后台管理系统，包含商品管理、订单管理、用户管理等核心功能。',
    link: 'https://example.com/project',
    visible: true
  }
]
```

```html
<rk-project-section 
  .data="${projects}"
  .globalSettings="${globalSettings}"
  show-title
></rk-project-section>
```

---

### `<rk-skill-section>`

技能模块组件。

#### 属性 (Properties)

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| `data` | `string` | - | ✅ | 技能描述内容（支持富文本） |
| `globalSettings` | `GlobalSettings` | `undefined` | ❌ | 全局样式设置 |
| `template-id` | `'classic' \| 'modern' \| 'timeline'` | `'classic'` | ❌ | 模板类型 |
| `show-title` | `boolean` | `true` | ❌ | 是否显示"技能"标题 |

#### 使用示例

```typescript
const skillContent = `
<div>
  <p><strong>前端技术：</strong>React、Vue、TypeScript、JavaScript、HTML5、CSS3</p>
  <p><strong>工程化：</strong>Webpack、Vite、Rollup、ESLint、Prettier</p>
  <p><strong>后端技术：</strong>Node.js、Express、NestJS</p>
  <p><strong>其他：</strong>Git、Docker、CI/CD</p>
</div>
`
```

```html
<rk-skill-section 
  .data="${skillContent}"
  .globalSettings="${globalSettings}"
  show-title
></rk-skill-section>
```

---

### `<rk-custom-section>`

自定义模块组件，用于添加额外的内容模块。

#### 属性 (Properties)

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| `section-id` | `string` | - | ✅ | 模块唯一标识 |
| `title` | `string` | - | ✅ | 模块标题 |
| `items` | `CustomItem[]` | - | ✅ | 自定义项目列表 |
| `globalSettings` | `GlobalSettings` | `undefined` | ❌ | 全局样式设置 |
| `template-id` | `'classic' \| 'modern' \| 'timeline'` | `'classic'` | ❌ | 模板类型 |
| `show-title` | `boolean` | `true` | ❌ | 是否显示标题 |

#### 使用示例

```typescript
const customItems: CustomItem[] = [
  {
    id: 'custom_1',
    title: '全国大学生数学建模竞赛',
    subtitle: '国家二等奖',
    dateRange: '2017.09',
    description: '参与数学建模竞赛，负责模型构建和论文撰写',
    visible: true
  }
]
```

```html
<rk-custom-section 
  section-id="awards"
  title="获奖经历"
  .items="${customItems}"
  .globalSettings="${globalSettings}"
  show-title
></rk-custom-section>
```

---

### `<rk-section-title>`

模块标题组件。

#### 属性 (Properties)

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| `title` | `string` | - | ✅ | 标题文本 |
| `icon` | `string` | `undefined` | ❌ | 图标名称（Lucide 图标） |
| `globalSettings` | `GlobalSettings` | `undefined` | ❌ | 全局样式设置 |

#### 使用示例

```html
<rk-section-title 
  title="工作经验"
  icon="Briefcase"
  .globalSettings="${globalSettings}"
></rk-section-title>
```

---

### `<rk-icon>`

图标组件，基于 Lucide 图标库。

#### 属性 (Properties)

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| `name` | `string` | - | ✅ | 图标名称 |
| `size` | `string` | `'24'` | ❌ | 图标尺寸（像素） |
| `color` | `string` | `'currentColor'` | ❌ | 图标颜色 |

#### 使用示例

```html
<rk-icon name="Mail" size="16" color="#333"></rk-icon>
<rk-icon name="Phone" size="18"></rk-icon>
<rk-icon name="MapPin" size="20" color="rgb(59, 130, 246)"></rk-icon>
```

#### 辅助函数

```typescript
import { getIconSVG, hasIcon } from '@resume-kit'

// 获取图标的 SVG 字符串
const svg = getIconSVG('Mail')

// 检查图标是否存在
const exists = hasIcon('Phone') // true
```

---

## TypeScript 类型

### `ResumeData`

完整的简历数据结构。

```typescript
interface ResumeData {
  id: string                                    // 简历唯一标识
  title: string                                 // 简历标题
  createdAt: string                             // 创建时间（ISO 格式）
  updatedAt: string                             // 更新时间（ISO 格式）
  templateId: string | null | undefined         // 模板 ID
  basic: BasicInfo                              // 基本信息
  education: Education[]                        // 教育背景
  experience: Experience[]                      // 工作经验
  projects: Project[]                           // 项目经验
  customData: Record<string, CustomItem[]>      // 自定义模块数据
  skillContent: string                          // 技能内容
  activeSection: string                         // 当前激活的模块
  draggingProjectId: string | null              // 正在拖拽的项目 ID
  menuSections: MenuSection[]                   // 菜单模块配置
  globalSettings: GlobalSettings                // 全局样式设置
}
```

---

### `BasicInfo`

基本信息数据结构。

```typescript
interface BasicInfo {
  name: string                                  // 姓名
  title: string                                 // 职位/头衔
  email: string                                 // 邮箱
  phone: string                                 // 电话
  location: string                              // 地址
  birthDate: string                             // 出生日期
  employementStatus: string                     // 在职状态
  icons: Record<string, string>                 // 字段对应的图标
  photo: string                                 // 照片 URL
  photoConfig: PhotoConfig                      // 照片配置
  fieldOrder?: BasicFieldType[]                 // 字段显示顺序
  customFields: CustomFieldType[]               // 自定义字段
  githubKey: string                             // GitHub API Key
  githubUseName: string                         // GitHub 用户名
  githubContributionsVisible: boolean           // 是否显示 GitHub 贡献图
  layout?: 'left' | 'center' | 'right'          // 布局方式
  [key: string]: any                            // 支持其他自定义属性
}
```

---

### `PhotoConfig`

照片配置。

```typescript
interface PhotoConfig {
  width: number                                          // 宽度（像素）
  height: number                                         // 高度（像素）
  aspectRatio: '1:1' | '4:3' | '3:4' | '16:9' | 'custom' // 宽高比
  borderRadius: 'none' | 'medium' | 'full' | 'custom'    // 圆角类型
  customBorderRadius: number                             // 自定义圆角值（像素）
  visible?: boolean                                      // 是否可见
}
```

---

### `BasicFieldType`

基本信息字段类型。

```typescript
interface BasicFieldType {
  id: string                                              // 字段 ID
  key: string                                             // 字段键名
  label: string                                           // 字段标签
  type?: 'date' | 'textarea' | 'text' | 'editor'          // 字段类型
  visible: boolean                                        // 是否可见
  custom?: boolean                                        // 是否为自定义字段
}
```

---

### `CustomFieldType`

自定义字段类型。

```typescript
interface CustomFieldType {
  id: string           // 字段 ID
  label: string        // 字段标签
  value: string        // 字段值
  icon?: string        // 图标名称
  visible?: boolean    // 是否可见
  custom?: boolean     // 是否为自定义字段
}
```

---

### `Education`

教育背景数据结构。

```typescript
interface Education {
  id: string              // 唯一标识
  school: string          // 学校名称
  major: string           // 专业
  degree: string          // 学历
  startDate: string       // 开始日期
  endDate: string         // 结束日期
  gpa?: string            // GPA（可选）
  description?: string    // 描述（可选）
  visible?: boolean       // 是否可见
}
```

---

### `Experience`

工作经验数据结构。

```typescript
interface Experience {
  id: string            // 唯一标识
  company: string       // 公司名称
  position: string      // 职位
  date: string          // 时间范围
  details: string       // 工作详情
  visible?: boolean     // 是否可见
}
```

---

### `Project`

项目经验数据结构。

```typescript
interface Project {
  id: string            // 唯一标识
  name: string          // 项目名称
  role: string          // 项目角色
  date: string          // 时间范围
  description: string   // 项目描述
  visible: boolean      // 是否可见
  link?: string         // 项目链接（可选）
}
```

---

### `Skill`

技能数据结构（备用）。

```typescript
interface Skill {
  id: string       // 唯一标识
  name: string     // 技能名称
  level: number    // 技能等级（1-5）
}
```

---

### `CustomItem`

自定义项目数据结构。

```typescript
interface CustomItem {
  id: string            // 唯一标识
  title: string         // 标题
  subtitle: string      // 副标题
  dateRange: string     // 时间范围
  description: string   // 描述
  visible: boolean      // 是否可见
}
```

---

### `GlobalSettings`

全局样式设置。

```typescript
interface GlobalSettings {
  themeColor?: string          // 主题色（十六进制颜色值）
  fontFamily?: string          // 字体系列
  baseFontSize?: number        // 基础字号（像素）
  pagePadding?: number         // 页面内边距（像素）
  paragraphSpacing?: number    // 段落间距（像素）
  lineHeight?: number          // 行高（倍数）
  sectionSpacing?: number      // 模块间距（像素）
  headerSize?: number          // 标题字号（像素）
  subheaderSize?: number       // 副标题字号（像素）
  useIconMode?: boolean        // 是否使用图标模式
  centerSubtitle?: boolean     // 副标题是否居中
}
```

#### 默认值

```typescript
const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  themeColor: '#000000',
  fontFamily: undefined,
  baseFontSize: 14,
  pagePadding: 32,
  paragraphSpacing: 8,
  lineHeight: 1.6,
  sectionSpacing: 24,
  headerSize: 18,
  subheaderSize: 16,
  useIconMode: false,
  centerSubtitle: true
}
```

---

### `MenuSection`

菜单模块配置。

```typescript
interface MenuSection {
  id: string         // 模块 ID
  title: string      // 模块标题
  icon: string       // 图标名称
  enabled: boolean   // 是否启用
  order: number      // 排序顺序
}
```

#### 默认模块

```typescript
const DEFAULT_MENU_SECTIONS: MenuSection[] = [
  { id: 'basic', title: '基本信息', icon: 'User', enabled: true, order: 0 },
  { id: 'experience', title: '工作经验', icon: 'Briefcase', enabled: true, order: 1 },
  { id: 'education', title: '教育背景', icon: 'GraduationCap', enabled: true, order: 2 },
  { id: 'projects', title: '项目经验', icon: 'FolderOpen', enabled: true, order: 3 },
  { id: 'skills', title: '技能', icon: 'Code', enabled: true, order: 4 }
]
```

---

## 工具函数

### `createInitialResumeData(options)`

创建初始化的简历数据。

#### 参数

```typescript
interface CreateInitialResumeOptions {
  title?: string                              // 简历标题
  templateId?: string | null                  // 模板 ID
  basicInfo?: Partial<BasicInfo>              // 基本信息（部分）
  education?: Education[]                     // 教育背景
  experience?: Experience[]                   // 工作经验
  projects?: Project[]                        // 项目经验
  skillContent?: string                       // 技能内容
  customData?: Record<string, CustomItem[]>   // 自定义数据
  globalSettings?: Partial<GlobalSettings>    // 全局设置（部分）
  menuSections?: MenuSection[]                // 菜单模块配置
}
```

#### 返回值

返回完整的 `ResumeData` 对象。

#### 使用示例

```typescript
import { createInitialResumeData } from '@resume-kit'

// 创建空白简历
const emptyResume = createInitialResumeData()

// 创建带初始数据的简历
const resume = createInitialResumeData({
  title: '张三的简历',
  basicInfo: {
    name: '张三',
    title: '前端工程师',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    location: '北京市'
  },
  experience: [
    {
      id: 'exp_1',
      company: 'ABC公司',
      position: '高级前端工程师',
      date: '2020.06 - 至今',
      details: '负责公司核心产品开发',
      visible: true
    }
  ],
  globalSettings: {
    themeColor: '#0047AB',
    baseFontSize: 14
  }
})
```

---

### `generateId(prefix)`

生成带前缀的唯一 ID。

#### 参数

- `prefix`: `string` - ID 前缀

#### 返回值

返回格式为 `{prefix}_{timestamp}_{random}` 的字符串。

#### 使用示例

```typescript
import { generateId } from '@resume-kit'

const resumeId = generateId('resume')    // 'resume_1699876543210_abc123'
const projectId = generateId('project')  // 'project_1699876543211_def456'
const educationId = generateId('edu')    // 'edu_1699876543212_ghi789'
```

---

### `getBorderRadiusValue(config)`

根据 PhotoConfig 获取 CSS 圆角值。

#### 参数

- `config`: `PhotoConfig` - 照片配置对象

#### 返回值

返回 CSS 圆角值字符串。

#### 使用示例

```typescript
import { getBorderRadiusValue } from '@resume-kit'
import type { PhotoConfig } from '@resume-kit'

const config: PhotoConfig = {
  width: 100,
  height: 100,
  aspectRatio: '1:1',
  borderRadius: 'full',
  customBorderRadius: 0,
  visible: true
}

const radius = getBorderRadiusValue(config) // '50%'
```

#### 返回值对应关系

| borderRadius | 返回值 |
|-------------|--------|
| `'none'` | `'0'` |
| `'medium'` | `'8px'` |
| `'full'` | `'50%'` |
| `'custom'` | `'{customBorderRadius}px'` |

---

### 图标相关函数

#### `getIconSVG(name)`

获取指定图标的 SVG 字符串。

```typescript
import { getIconSVG } from '@resume-kit'

const svg = getIconSVG('Mail')
// 返回: '<svg>...</svg>'
```

#### `hasIcon(name)`

检查指定图标是否存在。

```typescript
import { hasIcon } from '@resume-kit'

const exists = hasIcon('Mail')      // true
const notExists = hasIcon('Unknown') // false
```

#### `getIconLabel(name)`

获取图标的中文标签。

```typescript
import { getIconLabel } from '@resume-kit'

const label = getIconLabel('Mail')  // '邮件'
```

#### `getIconCategory(name)`

获取图标所属分类。

```typescript
import { getIconCategory } from '@resume-kit'

const category = getIconCategory('Mail')  // 'contact'
```

---

## 常量

### `THEME_COLORS`

预定义的主题颜色列表。

```typescript
const THEME_COLORS = [
  '#000000',  // 黑色
  '#1A1A1A',  // 深灰
  '#333333',  // 灰色
  '#4D4D4D',  // 中灰
  '#666666',  // 浅灰
  '#808080',  // 银灰
  '#999999',  // 淡灰
  '#0047AB',  // 钴蓝
  '#8B0000',  // 暗红
  '#FF4500',  // 橙红
  '#4B0082',  // 靛蓝
  '#2E8B57'   // 海绿
]
```

---

### 图标常量

#### `AVAILABLE_ICONS`

所有可用的图标名称数组。

```typescript
import { AVAILABLE_ICONS } from '@resume-kit'

console.log(AVAILABLE_ICONS)
// ['Mail', 'Phone', 'MapPin', 'Globe', ...]
```

#### `BASIC_INFO_ICONS`

基本信息常用图标。

```typescript
import { BASIC_INFO_ICONS } from '@resume-kit'

// 包含：Mail, Phone, MapPin, Globe, Calendar, Briefcase 等
```

#### `MENU_ICONS`

菜单模块图标。

```typescript
import { MENU_ICONS } from '@resume-kit'

// 包含：User, Briefcase, GraduationCap, FolderOpen, Code 等
```

#### `ICON_CATEGORIES`

图标分类对象，将图标按用途分组。

```typescript
import { ICON_CATEGORIES } from '@resume-kit'

// 结构：
// {
//   contact: ['Mail', 'Phone', 'MapPin', ...],
//   social: ['Github', 'Linkedin', 'Twitter', ...],
//   work: ['Briefcase', 'Building', 'Users', ...],
//   ...
// }
```

---

## 完整示例

### 创建完整的简历数据

```typescript
import { createInitialResumeData, generateId } from '@resume-kit'
import type { 
  ResumeData, 
  BasicInfo, 
  Education, 
  Experience, 
  Project 
} from '@resume-kit'

const resumeData: ResumeData = createInitialResumeData({
  title: '张三 - 高级前端工程师',
  basicInfo: {
    name: '张三',
    title: '高级前端工程师',
    email: 'zhangsan@example.com',
    phone: '138-0000-0000',
    location: '北京市海淀区',
    website: 'https://zhangsan.dev',
    photo: 'https://example.com/avatar.jpg',
    layout: 'left',
    photoConfig: {
      width: 100,
      height: 100,
      aspectRatio: '1:1',
      borderRadius: 'full',
      customBorderRadius: 0,
      visible: true
    }
  },
  education: [
    {
      id: generateId('edu'),
      school: '清华大学',
      major: '计算机科学与技术',
      degree: '本科',
      startDate: '2014-09',
      endDate: '2018-06',
      gpa: '3.8/4.0',
      visible: true
    }
  ],
  experience: [
    {
      id: generateId('exp'),
      company: 'ABC科技有限公司',
      position: '高级前端工程师',
      date: '2020.06 - 至今',
      details: '负责公司核心产品的前端架构设计和开发工作，带领团队完成多个重要项目。',
      visible: true
    }
  ],
  projects: [
    {
      id: generateId('proj'),
      name: '企业管理平台',
      role: '前端负责人',
      date: '2022.01 - 2022.12',
      description: '使用 React + TypeScript 构建的企业级管理系统。',
      link: 'https://example.com',
      visible: true
    }
  ],
  skillContent: `
    <div>
      <p><strong>前端技术：</strong>React、Vue、TypeScript、JavaScript</p>
      <p><strong>工程化：</strong>Webpack、Vite、Rollup</p>
    </div>
  `,
  globalSettings: {
    themeColor: '#0047AB',
    baseFontSize: 14,
    lineHeight: 1.6,
    useIconMode: true
  }
})
```

### 在应用中使用

```typescript
// React 示例
import { useEffect, useRef } from 'react'
import type { ResumeData } from '@resume-kit'
import '@resume-kit/dist/index.js'

function ResumeApp() {
  const previewRef = useRef<HTMLElement>(null)
  const [data, setData] = useState<ResumeData>(resumeData)

  useEffect(() => {
    if (previewRef.current) {
      (previewRef.current as any).value = data
    }
  }, [data])

  return (
    <rk-resume-preview 
      ref={previewRef}
      template-id="modern"
    />
  )
}
```

---

## 最佳实践

### 1. 性能优化

- 使用 `visible` 属性控制模块显示，隐藏不需要的内容
- 避免频繁更新整个 `ResumeData` 对象，只更新必要的部分
- 大量图标使用时考虑按需加载

### 2. 样式定制

- 优先使用 `GlobalSettings` 统一样式
- 利用 `themeColor` 快速切换主题
- 通过 `useIconMode` 切换展示风格

### 3. 数据管理

- 使用 `generateId` 生成唯一标识，避免 ID 冲突
- 合理使用 `customData` 添加自定义模块
- 通过 `menuSections` 的 `order` 属性调整模块顺序

### 4. TypeScript 集成

- 充分利用类型定义，获得完整的类型检查和自动补全
- 使用 `Partial<T>` 类型创建部分更新

```typescript
import type { BasicInfo } from '@resume-kit'

// 部分更新基本信息
const updateBasicInfo = (updates: Partial<BasicInfo>) => {
  setResumeData(prev => ({
    ...prev,
    basic: { ...prev.basic, ...updates }
  }))
}
```

---

## 浏览器兼容性

Resume Kit 基于现代 Web 标准构建，支持以下浏览器：

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

需要支持旧版浏览器时，请使用相应的 polyfill。

---

## 常见问题

### Q: 如何隐藏某个模块？

通过 `menuSections` 中对应模块的 `enabled` 属性控制：

```typescript
const data = createInitialResumeData({
  menuSections: [
    { id: 'basic', title: '基本信息', icon: 'User', enabled: true, order: 0 },
    { id: 'skills', title: '技能', icon: 'Code', enabled: false, order: 4 }
  ]
})
```

### Q: 如何添加自定义模块？

使用 `customData` 和 `menuSections`：

```typescript
const data = createInitialResumeData({
  customData: {
    'awards': [
      {
        id: 'award_1',
        title: '优秀员工',
        subtitle: 'ABC公司',
        dateRange: '2022',
        description: '年度优秀员工奖',
        visible: true
      }
    ]
  },
  menuSections: [
    ...DEFAULT_MENU_SECTIONS,
    { id: 'awards', title: '获奖经历', icon: 'Award', enabled: true, order: 5 }
  ]
})
```

### Q: 如何更改模块顺序？

调整 `menuSections` 中的 `order` 值：

```typescript
// 将项目经验放到工作经验前面
menuSections: [
  { id: 'basic', title: '基本信息', icon: 'User', enabled: true, order: 0 },
  { id: 'projects', title: '项目经验', icon: 'FolderOpen', enabled: true, order: 1 },
  { id: 'experience', title: '工作经验', icon: 'Briefcase', enabled: true, order: 2 }
]
```

---

## 更新日志

### v0.1.0

- 初始版本发布
- 支持基本信息、教育背景、工作经验、项目经验、技能等核心模块
- 提供三种内置模板：classic、modern、timeline
- 完整的 TypeScript 类型支持
- 基于 Lit 和 Tailwind CSS 构建

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

在提交 PR 之前，请确保：

1. 代码符合 TypeScript 规范
2. 添加必要的类型定义
3. 更新相关文档
4. 测试通过

---

## 许可证

MIT License

---

## 联系我们

- GitHub Issues: [提交问题](https://github.com/your-repo/resume-kit/issues)
- Email: [your-email@example.com](mailto:your-email@example.com)

