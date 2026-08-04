---
name: blog-web-design
description: 为南夏的 VitePress 博客项目提供专业的网页设计、组件开发和样式优化支持
---

# 博客网页设计技能

## 项目概述
这是基于 **VitePress 1.x + Vue 3 + TypeScript** 构建的个人博客项目「南夏的博客」。

### 技术栈
- **框架**: VitePress ^1.6.4
- **核心**: Vue 3 Composition API + TypeScript
- **样式**: CSS Variables + Scoped CSS
- **字体**: Source Han Serif SC (思源宋体)
- **主题**: 支持明暗双主题切换 + 视口过渡动画

### 设计系统规范

#### 颜色系统
| 主题 | 主色 | 悬停效果 | 用途 |
|------|------|----------|------|
| 品牌红 | `#e74c3c` | - | 强调文字、品牌色 |
| 前端蓝 | `#3b82f6` | `rgba(59, 130, 246, 0.08)` | 前端分类卡片 |
| 后端绿 | `#10b981` | `rgba(16, 185, 129, 0.08)` | 后端分类卡片 |
| 其他紫 | `#8b5cf6` | `rgba(139, 92, 246, 0.08)` | 杂项分类卡片 |
| 橙色 | `#f97316` | - | 调试分类 |
| 青色 | `#14b8a6` | - | 工程分类 |
| 红色 | `#ef4444` | - | 面试分类 |
| 黄色 | `#eab308` | - | 性能分类 |
| 靛蓝 | `#6366f1` | - | 数据库分类 |

#### VitePress CSS 变量
```css
--vp-c-bg-soft: rgba(246, 246, 247, 0.8)  // 浅色背景
--vp-c-bg-soft: rgba(32, 33, 39, 0.8)    // 深色背景
--vp-c-text-1, --vp-c-text-2, --vp-c-text-3  // 文字层级
--vp-c-divider                             // 分割线
```

#### 动画规范
- 卡片悬停: `transform: translateY(-4px)` + 边框变色 + 阴影
- 箭头动画: `transform: translateX(4px)`
- 主题切换: 圆形裁剪视口过渡动画 300ms ease-in
- 通用过渡: `all 0.3s ease`

### 组件设计规范

#### 卡片组件 (ArticleCard)
```
结构:
┌──────────────────────────────────┐
│ [分类徽章]                [标题] │
│                                  │
│ [描述文字...]                    │
│                              [→] │
└──────────────────────────────────┘

样式:
- 圆角: 12px
- 内边距: 1.5rem
- 最小高度: 160px
- 边框: 1.5px solid var(--vp-c-divider)
- 徽章定位: absolute top-right
```

#### 分类徽章
- 圆角: 20px
- 内边距: 0.25rem 0.75rem
- 字体: 0.75rem font-weight: 500
- 使用半透明背景 + 边框配色

### 工作流程

#### 1. 新增页面组件
**文件位置**: `docs/.vitepress/theme/pages/[name].vue

**标准模板**:
```vue
<script setup lang="ts">
// 导入数据和依赖
import data from '../../data/[name]Data'
</script>

<template>
  <div class="page-container">
    <!-- 页面内容 -->
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
</style>
```

#### 2. 注册组件
在 `docs/.vitepress/theme/index.ts` 中注册:
```typescript
import ComponentName from "./pages/ComponentName.vue"

export default {
  enhanceApp({ app }) {
    app.component("ComponentName", ComponentName)
  }
}
```

#### 3. 数据文件规范
**位置**: `docs/.vitepress/data/[name]Data.ts`

**接口定义**:
```typescript
export interface DataItem {
  title: string
  description: string
  link: string
  category?: string
  cover?: string
  date?: string
}
```

#### 4. 样式最佳实践
- 使用 CSS 变量而非硬编码颜色
- 支持 `.dark` 类进行深色模式适配
- 组件样式使用 `scoped`
- 移动端优先的响应式设计
- 使用 `var(--vp-c-*)` 系列变量保持主题一致性

### 特色功能开发指南

#### 背景组件 (Background.vue)
用于实现动态背景效果，支持明暗主题切换。

#### 音乐播放器 (MusicPlayer.vue)
- 集成在导航栏 `#nav-bar-content-before` 插槽
- 使用全局 provide/inject 传递播放状态

#### Live2D 看板娘
- 独立组件，可通过注释开关启用
- 位置: `docs/.vitepress/theme/components/Live2d.vue`

### 目录结构参考
```
docs/.vitepress/
├── config.mts              # 主配置文件
├── theme/
│   ├── index.ts            # 主题入口
│   ├── Layout.vue          # 自定义布局
│   ├── style/var.css       # 全局样式变量
│   ├── pages/              # 页面组件
│   │   ├── knowledge.vue
│   │   ├── music.vue
│   │   └── ...
│   └── components/         # 通用组件
│       ├── ArticleCard.vue
│       ├── MusicPlayer.vue
│       └── ...
├── data/                   # 数据文件
│   ├── knowledgeData.ts
│   ├── musicData.ts
│   └── ...
└── store/                  # 状态管理
    └── index.ts
```

### 设计原则
1. **一致性**: 所有组件遵循相同的间距、圆角、阴影规范
2. **响应式**: 适配移动端、平板、桌面端
3. **无障碍**: 合理的颜色对比度、语义化 HTML
4. **性能**: 图片懒加载、动画使用 `will-change` 优化
5. **可维护性**: 组件粒度适中、单一职责原则

## 使用示例

### 示例 1: 创建新的卡片列表页面
```vue
<template>
  <div class="page-container">
    <h1 class="page-title">页面标题</h1>
    <div class="card-grid">
      <ArticleCard 
        v-for="item in items" 
        :key="item.link"
        :article="item"
        theme="frontend"
      />
    </div>
  </div>
</template>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
</style>
```

### 示例 2: 添加主题切换动画
```typescript
// 参考 Layout.vue 中的主题切换实现
provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  // 圆形裁剪 + 视口过渡动画实现
})
```
