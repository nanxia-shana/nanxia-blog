---
layout: doc

lastUpdated: false
title: 首屏白屏优化
description: 从原理到实战，系统讲解单页面应用白屏问题的原因分析、优化手段和效果验证
category: 基础
date: 2026-05-08
---

# 首屏白屏优化

## 1. 问题引入

我们在用Vue或者React写单页面应用的时候应该都遇到过一个问题：页面刚打开的时候会有一段时间是空白的，少则几百毫秒，多则好几秒。这段时间用户只能对着一个白屏发呆，体验非常不好。

我之前做的几个项目都遇到过这个问题，尤其是后台管理系统，依赖一大堆第三方库，打包出来的 JS 体积动不动就好几 MB，首屏白屏时间能到 3 秒以上。用户反馈说「你们这个系统怎么这么卡，半天出不来」，其实后端接口响应很快，但是问题出在前端渲染这块。

白屏时间直接影响用户的第一印象，有数据说超过 3 秒加载不出，40% 的用户就会直接关掉页面。所以解决白屏问题，还是很有必要的。

这篇文章就来系统梳理一下，单页面应用为什么会有白屏问题，以及有哪些具体的优化手段。

## 2. 白屏原因分析

要解决问题，首先得弄明白问题出在哪。先看看一个 SPA 从输入 URL 到首屏渲染完成，中间都经历了什么。

### 渲染链路拆解

<img src="/markdown/frontend/base/Rendering-Pipeline-Breakdown.png" alt="加载失败" />

这里面每个环节都可能成为瓶颈，导致白屏时间变长。但对于大部分前端项目来说，问题主要集中在这几个地方：

**JS 体积过大**：这是最常见的原因。很多项目图方便，直接把整个 UI 组件库全量引入，再加上 Lodash、Moment 这些工具库，打包出来 vendor.js 轻轻松松就上 2MB 了。

**JS 执行时间长**：JS 下载完还需要解析执行，浏览器是单线程的，执行 JS 的时候没法渲染页面。尤其是 React/Vue 这些框架，初始化的时候要做很多事情。

**网络延迟**：这个虽然不是前端能完全控制的，但我们可以通过缓存、CDN 等手段来缓解。

### 用 Performance 面板定位问题

口说无凭，到底是哪个环节慢，我们可以用 Chrome 的 Performance 面板来精确测量。

打开 F12，切到 Performance 标签，点击刷新按钮录制一下，就能看到完整的时间线：

```
Network 部分看各个资源的下载时间
Main 部分看 JS 执行耗时
FP / FCP 标记就是首次绘制的时间点
```

::: tip 小提示
看 Performance 面板的时候，重点关注这几个指标：
- FP（First Paint）：第一个像素渲染出来的时间
- FCP（First Contentful Paint）：第一次有内容渲染出来的时间
- LCP（Largest Contentful Paint）：最大内容渲染完成时间

这几个指标基本就能量化白屏的严重程度。
:::

## 3. 代码层面优化

### 路由懒加载

这个是最基础也是效果最明显的优化。不要把所有页面都打包到一个 JS 里，按需加载，访问哪个页面再加载哪个页面的代码。

Vue Router 的写法：

```javascript
// 不推荐：直接引入，会打包到主 bundle
import Home from './views/Home.vue'

// 推荐：动态引入，路由级别的代码分割
const Home = () => import('./views/Home.vue')
const About = () => import('./views/About.vue')

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]
```

React 的写法也类似：

```jsx
// React.lazy + Suspense
const Home = React.lazy(() => import('./views/Home'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Suspense>
  )
}
```

### 第三方库按需引入

很多 UI 组件库支持按需引入，不需要全量加载。

以 Element Plus 为例：

```javascript
// 不推荐：全量引入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)

// 推荐：按需引入，配合 unplugin-auto-import 自动处理
import { ElButton, ElInput } from 'element-plus'
app.component(ElButton.name, ElButton)
app.component(ElInput.name, ElInput)
```

Lodash 也不要全量引入：

```javascript
// 不推荐
import _ from 'lodash'

// 推荐：只引入用到的方法
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
```

### Tree Shaking 配置

确保打包工具能正确做 Tree Shaking，移除没有用到的代码。

Vite 项目默认已经开启了 Tree Shaking，Webpack 需要注意：

- 使用 ES Module 语法，不要用 require
- 确保 sideEffects 配置正确

```json
// package.json
{
  "sideEffects": ["*.css", "*.scss"]
}
```

::: danger 踩坑提醒
有些第三方库不支持 Tree Shaking，比如某些旧版本的组件库，你就算只引入一个组件，实际上还是会把整个库都打包进去。

遇到这种情况，可以用 webpack-bundle-analyzer 分析一下打包结果，看看各个模块占的体积，有没有异常大的包。如果确实有问题，可以考虑换个库，或者用改 imports 路径的方式强制按需引入。
:::

### 代码分割策略

合理配置打包后的 chunk 拆分，不要把所有第三方库都打到一个 vendor.js 里：

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 把框架单独打包
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // UI 库单独打包
          'ui-vendor': ['element-plus'],
          // 工具库单独打包
          'utils-vendor': ['lodash-es', 'dayjs']
        }
      }
    }
  }
})
```

这样拆分的好处是，业务代码经常变，但第三方库很少升级，浏览器可以长期缓存这些 chunk。

## 4. 资源加载优化

代码层面优化完了，接下来就是让资源更快地下载到用户浏览器。

### 开启 Gzip / Brotli 压缩

这是成本最低效果最明显的优化之一。文本类资源（JS、CSS、HTML）压缩后体积通常能降到原来的 1/3 左右。

Nginx 配置示例：

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
```

Brotli 压缩率比 Gzip 还要好一些，现在大部分现代浏览器都支持了，如果服务器支持的话推荐开启。

### CDN 加速

把静态资源都放到 CDN 上，用户可以从离自己最近的节点下载，速度比访问源站快很多。

CDN 还可以配置缓存策略，比如：

```
HTML：协商缓存，每次都检查更新
JS/CSS/图片：强缓存，文件名带 hash，缓存一年
```

这样用户第二次访问的时候，大部分资源直接从缓存里读，几乎不需要网络请求。

### 预加载策略

对于首屏必须的关键资源，可以用 preload 提前告诉浏览器去下载：

```html
<link rel="preload" href="/assets/main.js" as="script">
<link rel="preload" href="/assets/main.css" as="style">
```

对于可能用到的非关键资源，用 prefetch 做预获取：

```html
<link rel="prefetch" href="/assets/about.js">
```

还可以提前做 DNS 解析：

```html
<link rel="dns-prefetch" href="//your-cdn.com">
```

### 图片优化

图片往往是页面里体积最大的资源，这块的优化空间也很大：

1. **懒加载**：首屏不需要的图片，滚动到可视区域再加载
2. **用 WebP 格式**：同样质量，体积比 JPG 小 30% 左右
3. **响应式图片**：根据屏幕尺寸加载不同大小的图片
4. **图片压缩**：上传前先用 TinyPNG 之类的工具压一遍

```html
<!-- 懒加载示例 -->
<img src="placeholder.jpg" data-src="real-image.jpg" class="lazyload">

<!-- 响应式图片 -->
<img 
  srcset="image-300.jpg 300w, image-600.jpg 600w"
  sizes="(max-width: 600px) 300px, 600px"
  src="image-600.jpg" 
  alt="示例"
>
```

## 5. 渲染体验优化

前面的优化都是让页面「真正变快」，但有时候受限于网络或设备性能，再怎么优化也不可能无限快。这时候我们可以做一些体验上的优化，让用户感觉「变快了」。

### 骨架屏

在内容加载出来之前，先渲染一个页面结构的骨架，用户就不会觉得是在白屏等着了。

骨架屏的实现方案有几种：

1. 手写 CSS 骨架屏样式，适合简单页面
2. 用现成的组件库，比如 Element Plus 的 Skeleton 组件
3. 自动化生成：用 webpack 插件根据页面结构自动生成骨架屏代码

一个简单的骨架屏示例：

```vue
<template>
  <div class="skeleton-page">
    <div class="skeleton-header"></div>
    <div class="skeleton-list">
      <div v-for="i in 5" :key="i" class="skeleton-item">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-page {
  padding: 20px;
}
.skeleton-header {
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 20px;
}
/* ... 更多样式 */

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
```

### 首屏关键 CSS 内联

如果 CSS 文件很大，下载 CSS 这段时间页面也是无样式的白屏。可以把首屏用到的关键 CSS 提取出来，内联到 HTML 里，这样 HTML 下载完就能立刻渲染出正确的样式。

Vite 有插件可以自动做这件事：`vite-plugin-css-injected-by-js` 或者 `critters`。

### Loading 过渡

最简单的方案，在根节点里先写个 Loading 提示：

```html
<div id="app">
  <div class="initial-loading">
    <div class="spinner"></div>
    <p>页面加载中...</p>
  </div>
</div>
```

然后 JS 渲染完成后会自动替换掉这个内容，至少比白屏要好。

## 6. 效果验证与监控

优化做完了，一定要有数据来证明效果，不能凭感觉说「好像变快了」。

### 核心性能指标

Google 推荐的几个核心 Web Vitals：

- LCP（最大内容绘制）：应该在 2.5 秒以内
- FID（首次输入延迟）：应该在 100 毫秒以内
- CLS（累积布局偏移）：应该在 0.1 以内

### Lighthouse 审计

用 Chrome 的 Lighthouse 跑一下性能审计，会给出详细的评分和优化建议：

```
性能分数越高越好，一般做到 80 分以上就算良好了
重点看 Opportunities 部分，会告诉你具体哪里可以优化
```

### 建立线上监控

本地和测试环境快不算真的快，一定要监控线上真实用户的体验数据。

可以自己埋点上报，或者用现成的监控服务：

- Sentry：同时可以监控性能和错误
- 阿里云 / 腾讯云的前端监控
- Google Analytics

重点监控几个指标的 P50、P90、P99 值，观察优化后的变化趋势。

## 7. 总结与思考

对于不同阶段的项目，优化优先级也不一样。

**新项目**：一开始就要做好代码分割、按需引入这些基础配置，避免后期积重难返。

**已上线项目**：先做分析，找到最大的瓶颈在哪里，集中火力优化最严重的问题。一般来说，JS 体积优化和压缩 + CDN 这几个做了，就能解决 80% 的白屏问题。

**不要过度优化**：比如为了减少几十 KB 的体积，把代码写得很难维护，就得不偿失了。性能优化是为了用户体验，不是为了追求极致的数字。
