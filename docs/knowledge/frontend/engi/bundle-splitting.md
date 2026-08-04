---
layout: doc

lastUpdated: false
title: 前端项目打包分包实践
description: 记录前端项目打包分包的常见思路，包含 Webpack、Vite 的具体操作，以及 Vue 和 React 项目在分包上的差异分析。
category: 工程化
date: 2026-06-09
---

# 前端项目打包分包实践

对于刚开始做前端项目的我来说，“打包”这件事似乎很简单：写完代码，执行一条 `build` 的命令，生成一个 `dist` 目录，然后丢到服务器上就行。

但是随着工作时间的增长，开发的项目越来越大时，问题就慢慢出现了，我开始关注前端开发者在成长阶段绕不开的一个问题，那就是前端工程化，而前端打包则是前端工程化的核心基础设施与关键落地环节。

我首次面对这样的问题，是被反映页面首屏加载的速度很慢，相信这也是大部分人刚开始接触打包优化时所要解决的第一个问题。由于没有做任何处理，导致构建产物中单个 JS 文件动辄数 MB，改了一行业务代码，用户却要重新下载一整个大包。这个时候再回头看打包，就不能只停留在“能不能跑”这一层了，还要考虑包体积、缓存、加载顺序和用户实际打开页面时的体验。

## 1. 为什么要关注打包分包

正如我在文章开头所描述的那样，现在的前端项目通常不会直接把源代码丢给浏览器运行。我们写的 Vue、React、TypeScript、Sass、Less、图片资源、第三方依赖，最后都需要经过构建工具处理，变成浏览器能加载的 HTML、CSS、JS 和静态资源。

如果项目很小，把所有代码都打进一个文件里也没什么问题。但项目一旦变大，单个 bundle 过大就会带来几个明显的问题。

第一是首屏加载慢。浏览器必须先下载并解析这个大 JS 文件，页面才能真正动起来。用户看到白屏的时间会变长。

第二是缓存利用率差。假设所有代码都在 `app.js` 里，只要业务代码改了一点，`app.js` 的 hash 就变了，用户下一次访问时需要重新下载整个文件。即使里面的大部分第三方库并没有变，也没法继续利用缓存。

第三是异步页面被提前加载。很多后台管理系统里，用户可能只访问首页和列表页，但如果所有页面都被打进首屏 JS 里，等于用户一开始就下载了很多暂时用不到的代码。

分包要解决的就是这些问题。它的核心不是“把包拆得越碎越好”，而是让浏览器在合适的时间下载合适的代码。

::: info 比较理想的状态是

- **首次加载**首屏必须运行的代码
- **单独缓存**第三方稳定依赖
- **访问该页面时再加载**某个页面的代码
- **真正使用时再加载**大型功能模块

:::

这样做之后，首屏包会变小，长期缓存也会更稳定。

## 2. 打包和分包到底在做什么

打包可以简单理解为：构建工具从入口文件开始，分析模块之间的依赖关系，然后把这些模块转换、合并、压缩，最后输出浏览器能运行的文件。

以一个简单项目为例：

<img src="/markdown/frontend/engi/bundle-splitting_01.png" alt="加载失败" />

构建工具会从 `main.ts` 出发，把它依赖的内容一层一层找出来，形成依赖图。然后根据配置决定这些模块应该被打进哪个产物文件里。

没有分包时，产物可能类似这样：

```text
dist/
├─ index.html
├─ assets/app.8f3a1.js
└─ assets/style.2b91c.css
```

所有 JS 都在 `app.8f3a1.js` 里。项目小的时候很清爽，项目大了之后就容易变成一个巨大的入口包。

分包后，产物可能变成这样：

```text
dist/
├─ index.html
├─ assets/app.91ab2.js
├─ assets/vendor.7c012.js
├─ assets/common.31f9a.js
├─ assets/user-page.a8d21.js
├─ assets/chart-page.c8e23.js
└─ assets/style.2b91c.css
```

这里每个文件就有了不同职责：

- `app`：项目入口和启动逻辑；
- `vendor`：第三方依赖；
- `common`：多个页面共享的公共代码；
- `user-page`：用户页面代码；
- `chart-page`：图表页面代码。

分包不是不打包，而是把原本一个大包拆成多个更合适的小包。

## 3. 常见的分包方式

项目中最常见的分包方式有几类。

### 路由级分包

这是最常用，也最推荐先做的方式。一个页面对应一个异步 chunk，用户访问这个页面时才加载对应代码。

比如后台系统中有用户管理、订单管理、数据报表、系统设置。用户进入首页时，不需要立刻下载所有页面的代码。

### 组件级分包

某些组件很重，但不是页面一加载就要显示，比如富文本编辑器、代码编辑器、地图、图表、弹窗里的复杂表单。这类组件可以单独做异步加载。

### 第三方依赖分包

`vue`、`react`、`lodash`、`echarts`、`monaco-editor` 这些依赖通常比较稳定，不会随着业务代码频繁变化。把它们拆出来可以提高缓存命中率。

### 公共模块分包

如果多个页面都引用了同一批工具函数或业务组件，构建工具可能会把它们抽成公共 chunk，避免重复打包。

### 手动分包

当自动分包结果不理想时，可以通过配置明确告诉构建工具：某些依赖应该放到某个 chunk 里。这在 Vite 和 Rollup 项目里很常见。

::: warning 注意
分包不是越细越好。chunk 数量过多会带来更多请求、更多调度成本，也可能让缓存和预加载策略变复杂。一般先从路由懒加载和大依赖拆分开始，不要一上来就把所有东西拆得很碎。
:::

## 4. Webpack 项目中如何做分包

Webpack 里的分包主要依赖两件事：

1. 动态导入 `import()`；
2. `optimization.splitChunks` 配置。

动态导入决定“哪些模块可以异步加载”，`splitChunks` 决定“公共依赖和第三方依赖怎么拆”。

### 使用动态导入

普通静态导入是这样的：

```ts
import UserPage from './pages/UserPage.vue';
```

这种写法会让 `UserPage` 进入当前入口包。

改成动态导入：

```ts
const UserPage = () => import('./pages/UserPage.vue');
```

Webpack 看到 `import()` 后，会把这个模块拆成异步 chunk。只有代码运行到这里时，浏览器才会加载对应 JS 文件。

### Vue Router 中的路由懒加载

Vue 项目里最常见的写法是：

```ts
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/user',
      component: () => import('@/pages/UserPage.vue'),
    },
    {
      path: '/order',
      component: () => import('@/pages/OrderPage.vue'),
    },
  ],
});

export default router;
```

这样 `/user` 和 `/order` 就会分别生成异步 chunk。

如果想给 chunk 起名，Webpack 支持魔法注释：

```ts
const UserPage = () => import(
  /* webpackChunkName: "user-page" */
  '@/pages/UserPage.vue'
);
```

构建后文件名会更容易看懂。不过现在很多项目都依赖 hash 文件名和分析工具，是否手动命名看团队习惯即可。

### React Router 中的懒加载

React 项目可以用 `React.lazy`：

```tsx
import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const UserPage = React.lazy(() => import('@/pages/UserPage'));
const OrderPage = React.lazy(() => import('@/pages/OrderPage'));

export const router = createBrowserRouter([
  {
    path: '/user',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <UserPage />
      </Suspense>
    ),
  },
  {
    path: '/order',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <OrderPage />
      </Suspense>
    ),
  },
]);
```

React Router 新版本也支持路由级 `lazy`，写法会更贴近路由配置：

```tsx
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/user',
    lazy: async () => {
      const module = await import('@/pages/UserPage');
      return { Component: module.default };
    },
  },
]);
```

### 配置 splitChunks

Webpack 5 中常见的基础配置如下：

```js
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: 'single',
  },
};
```

这段配置做了几件事：

- `chunks: 'all'`：同步和异步模块都参与分包；
- `vendors`：把 `node_modules` 中的依赖拆到 `vendors`；
- `common`：被至少两个 chunk 使用的模块抽成公共包；
- `runtimeChunk: 'single'`：把 Webpack runtime 单独拆出来，减少业务包 hash 变化。

::: tip 小提示
`runtimeChunk` 很容易被忽略。它本身不大，但把 runtime 拆出来后，业务代码和依赖包的缓存会更稳定。对于长期缓存策略来说，这是一个比较实用的配置。
:::

### 更细地拆第三方依赖

如果项目里有特别大的库，比如 `echarts`、`monaco-editor`，可以单独拆出来：

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        echarts: {
          test: /[\\/]node_modules[\\/]echarts[\\/]/,
          name: 'echarts',
          priority: 30,
        },
        monaco: {
          test: /[\\/]node_modules[\\/]monaco-editor[\\/]/,
          name: 'monaco',
          priority: 30,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
      },
    },
  },
};
```

这里 `priority` 很重要。优先级高的规则会先匹配，否则 `echarts` 可能已经被 `vendors` 吃掉了。

### 使用 webpack-bundle-analyzer 分析产物

分包之前最好先看一下当前包里到底有什么。可以安装分析工具：

```bash
npm install webpack-bundle-analyzer -D
```

然后在配置里加入插件：

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      openAnalyzer: true,
    }),
  ],
};
```

执行构建后，它会打开一个可视化页面，展示每个模块在最终 bundle 中占了多少体积。

::: danger 踩坑提醒
不要只看源码大小，也要看 gzip 或 brotli 后的体积。有些库源码看起来很大，但压缩后还可以；有些库看起来不大，却会带来额外的运行时代码和样式资源。判断是否需要拆分时，要结合实际构建产物看。
:::

## 5. Vite 项目中如何做分包

Vite 和 Webpack 的开发体验差异很大。Vite 开发阶段基于原生 ESM，启动速度很快；生产构建时，默认使用 Rollup 打包。

所以在 Vite 项目里，分包主要看两部分：

1. 路由或组件中的动态导入；
2. Rollup 的 `manualChunks` 配置。

### Vue 项目路由懒加载

Vite + Vue 中的路由懒加载写法和 Webpack 下基本一样：

```ts
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/dashboard',
      component: () => import('@/pages/Dashboard.vue'),
    },
    {
      path: '/charts',
      component: () => import('@/pages/Charts.vue'),
    },
  ],
});

export default router;
```

构建后，`Dashboard.vue` 和 `Charts.vue` 会被拆成异步 chunk。

### React 项目组件懒加载

Vite + React 中也是通过动态导入触发分包：

```tsx
import { lazy, Suspense } from 'react';

const Charts = lazy(() => import('@/pages/Charts'));

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Charts />
    </Suspense>
  );
}
```

这和构建工具关系不大，本质仍然是 `import()`。

### 使用 manualChunks 手动分包

Vite 的配置文件里可以通过 `build.rollupOptions.output.manualChunks` 控制分包：

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          echarts: ['echarts'],
          lodash: ['lodash-es'],
        },
      },
    },
  },
});
```

这会把这些依赖拆到独立 chunk 中。比如 Vue 相关依赖在 `vue` chunk，图表库在 `echarts` chunk。

如果想更自动一点，可以写成函数形式：

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('echarts')) {
              return 'echarts';
            }
            if (id.includes('monaco-editor')) {
              return 'monaco';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
```

这个配置的意思是：

- `echarts` 单独一个包；
- `monaco-editor` 单独一个包；
- 其它 `node_modules` 依赖进入 `vendor`。

::: warning 注意
`manualChunks` 不建议写得太激进。比如把每个依赖都单独拆成一个 chunk，看起来很细，实际可能导致请求数量变多，也可能让加载链路更复杂。通常只需要拆稳定依赖和明显的大依赖。
:::

### 组件级异步加载

除了路由页面，有些重组件也适合异步加载。Vue 可以使用 `defineAsyncComponent`：

```ts
import { defineAsyncComponent } from 'vue';

const RichEditor = defineAsyncComponent(() => import('@/components/RichEditor.vue'));
```

React 则可以使用 `lazy`：

```tsx
import { lazy, Suspense } from 'react';

const RichEditor = lazy(() => import('@/components/RichEditor'));

export function EditorPanel() {
  return (
    <Suspense fallback={<div>编辑器加载中...</div>}>
      <RichEditor />
    </Suspense>
  );
}
```

适合这样处理的组件一般有几个特点：

- 首屏不一定出现；
- 自身体积比较大；
- 依赖大型第三方库；
- 用户触发某个操作后才需要。

比如富文本编辑器、地图、图表大屏、代码编辑器、文件预览器，都可以考虑异步加载。

### 使用 rollup-plugin-visualizer 分析产物

Vite 项目可以使用 `rollup-plugin-visualizer`：

```bash
npm install rollup-plugin-visualizer -D
```

配置如下：

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

构建后打开 `dist/stats.html`，就能看到每个 chunk 的组成。

## 6. Webpack 和 Vite 的分包思路有什么区别

Webpack 和 Vite 的分包目标其实很接近，都是为了控制首屏体积、提高缓存利用率、让代码按需加载。但它们的实现方式和配置习惯不太一样。

Webpack 更强调通过 `optimization.splitChunks` 统一控制分包规则。它会根据 `cacheGroups`、`minChunks`、`priority` 等配置自动抽取公共模块和第三方依赖。配置能力很强，但理解成本也高一些。

Vite 生产构建基于 Rollup，更常见的做法是用动态导入配合 `manualChunks`。它没有 Webpack 的 `splitChunks.cacheGroups` 那么复杂，思路更直接：你告诉 Rollup 哪些模块应该进入哪个 chunk。

可以简单对比一下：
::: tip Webpack 与 Vite 对比

- Webpack 的路径是先做入口分析，再由 `splitChunks` 自动抽取公共模块，最终通过 `cacheGroups` 控制 vendors、common、runtime 等 chunk 的归属；

- Vite 的路径则是先用动态导入做代码分割，再交给 Rollup 构建，最终通过 `manualChunks` 指定哪些依赖应该拆到独立 chunk。

***前者是"规则驱动的自动抽取"，后者是"入口驱动的手动声明"。***

:::
如果项目里有很复杂的历史配置、微前端、模块联邦、特殊 loader 链路，Webpack 的生态和控制能力仍然很强。

如果是新项目，尤其是 Vue、React 的常规应用，Vite 的体验会更轻，分包配置也通常更少。

不过到了生产优化阶段，它们最终都绕不开几个共同问题：

- 哪些代码首屏必须加载；
- 哪些页面可以异步加载；
- 哪些依赖适合长期缓存；
- 哪些模块被重复打包；
- chunk 数量是否合理。

所以工具不同，思考方式不能完全不同。

## 7. 其它构建工具简要分析

除了 Webpack 和 Vite，前端工程里还会遇到一些其它构建工具。

### Rollup

Rollup 更常用于库打包。它对 ES Module 的静态分析和 Tree Shaking 支持很好，输出结果比较干净。很多组件库、工具库都会用 Rollup。

应用项目也可以用 Rollup，但如果是复杂应用，通常需要自己处理更多工程细节。Vite 生产构建底层就是 Rollup，所以大多数应用项目不需要直接使用 Rollup。

### Esbuild

Esbuild 最大的特点是快。它用 Go 编写，转译和压缩速度非常优秀。Vite 开发阶段的依赖预构建就用到了 Esbuild。

不过 Esbuild 在复杂分包、插件生态、细粒度优化方面，相比 Webpack 和 Rollup 会更克制。它很适合作为构建链路中的高性能基础工具。

### Rspack

Rspack 可以理解为走 Webpack 兼容路线的新一代构建工具，底层使用 Rust，目标是提高构建性能，同时尽量兼容 Webpack 生态。

如果老项目已经有大量 Webpack 配置，又想提升构建速度，Rspack 是值得关注的方向。它的分包思路和 Webpack 比较接近，也有类似的优化配置。

### Parcel

Parcel 的特点是零配置或者少配置。它适合一些中小项目、原型项目，开发体验比较直接。对于需要非常精细控制构建产物的大型项目，团队可能还是会选择 Webpack、Vite 或 Rspack。

### Turbopack

Turbopack 更偏向大型项目构建性能和未来生态方向，尤其和 Next.js 的关系比较密切。它的目标是解决大型应用构建和热更新性能问题。

对于普通业务项目来说，现阶段更常见的选择还是 Vite、Webpack 或 Rspack。

## 8. Vue 和 React 项目分包有区别吗

结论先说：**构建层面的分包没有本质区别，区别主要在框架写法上。**

不管是 Vue 还是 React，只要使用的是 Webpack、Vite、Rollup 这类构建工具，触发异步分包的核心方式都是动态导入：

```ts
import('./SomeModule');
```

构建工具看到这个语法，就有机会把 `SomeModule` 单独拆成异步 chunk。

Vue 和 React 的区别主要体现在“框架如何消费这个异步模块”。

### Vue 中的写法

Vue Router 中直接写动态导入：

```ts
const routes = [
  {
    path: '/profile',
    component: () => import('@/pages/Profile.vue'),
  },
];
```

组件级异步加载可以用：

```ts
import { defineAsyncComponent } from 'vue';

const ProfileCard = defineAsyncComponent(() => import('@/components/ProfileCard.vue'));
```

Vue 会帮你处理异步组件加载过程。

### React 中的写法

React 常用 `lazy` 和 `Suspense`：

```tsx
import { lazy, Suspense } from 'react';

const Profile = lazy(() => import('@/pages/Profile'));

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Profile />
    </Suspense>
  );
}
```

React 需要通过 `Suspense` 提供加载时的兜底 UI。

### 第三方依赖拆分没有框架差异

比如你要拆 `echarts`、`lodash-es`、`monaco-editor`，Vue 和 React 没有本质区别。因为这些都是构建工具层面的模块拆分。

Webpack 看的是模块依赖图，Vite/Rollup 看的是模块依赖图，不会因为你写 Vue 或 React 就改变分包本质。

真正可能不同的是框架生态自带的方案。比如 Next.js、Nuxt 这种上层框架，会帮你处理页面级分包、预加载、服务端渲染和客户端水合，这时你需要遵守它们自己的约定。

## 9. 分包不是越细越好

很多人刚开始做分包优化时，容易陷入一个误区：看到一个大包就想拆，看到一个依赖就想单独分出来。最后构建产物从几个文件变成几十个甚至上百个文件，看起来很精细，但实际体验不一定更好。

原因有几个。

第一，请求数量会变多。虽然 HTTP/2 对多请求更友好，但不代表请求没有成本。浏览器仍然需要调度、下载、解析和执行这些资源。

第二，加载链路可能变长。一个异步页面如果又依赖多个异步 chunk，用户进入页面时可能要等一串资源加载完成。

第三，公共模块可能被拆得不合理。如果配置不当，某些模块可能在多个 chunk 中重复出现，导致总体积反而变大。

第四，缓存策略会变复杂。分包之后，每个 chunk 都有自己的 hash。合理情况下这是好事，但如果公共 chunk 经常变化，用户还是会频繁重新下载。

所以判断分包效果，不能只看文件数量，也不能只看单个文件大小。更应该看：

- 首屏 JS 体积是否下降；
- 首屏加载时间是否改善；
- 大依赖是否被稳定缓存；
- 异步页面加载是否可接受；
- 是否出现重复打包；
- gzip 或 brotli 后体积是否合理。

::: danger 踩坑提醒
我以前做包体积优化时，也有过“越拆越安心”的想法。后来发现页面进入某个功能时反而多等了一段时间，因为它需要连续加载好几个 chunk。分包的目标不是让构建产物看起来漂亮，而是让用户实际访问更快。
:::

## 10. 一个推荐的实践流程

如果要给一个已有项目做分包优化，我一般不建议直接上来改配置。更稳的流程是先分析，再调整，再验证。

### 第一步：先构建一次

先执行生产构建：

```bash
npm run build
```

看一下 `dist/assets` 里生成了哪些文件，每个文件大概多大。

### 第二步：接入分析工具

Webpack 项目可以用 `webpack-bundle-analyzer`，Vite 项目可以用 `rollup-plugin-visualizer`。

目标是弄清楚几个问题：

- 最大的 chunk 是哪个；
- 最大的第三方依赖是什么；
- 某些库是否被重复打包；
- 首屏入口包里有没有不该出现的大模块。

### 第三步：先做路由懒加载

路由懒加载通常是收益最大、风险较低的一步。尤其是后台管理系统、多页面控制台、文档平台这类项目，页面天然适合按路由拆分。

### 第四步：拆大型第三方库

如果发现 `echarts`、`monaco-editor`、地图 SDK、富文本编辑器这类库进入了首屏包，就要考虑把它们异步化，或者单独拆成 chunk。

### 第五步：调整公共依赖

Webpack 中检查 `splitChunks`，Vite 中检查 `manualChunks`。重点看公共模块是否合理，vendor 包是否过大，大依赖是否需要单独分离。

### 第六步：重新构建并对比

改完配置后再次构建，对比：

```text
优化前入口包大小
优化后入口包大小
优化前总 JS 体积
优化后总 JS 体积
异步 chunk 数量变化
```

不要只看“入口包变小了”，也要看总量有没有明显增加。

### 第七步：上线后观察真实指标

本地构建结果只能说明一部分问题，最终还要看线上表现。可以关注：

- FCP；
- LCP；
- TTI；
- 首屏 JS 请求数量；
- JS 下载和执行耗时；
- 路由切换时异步 chunk 加载耗时。

## 11. 总结

项目的打包分包并不是为了把配置写得更复杂，而是为了让代码在更合适的时间被加载。

对大多数项目来说，优先级可以这样排：

::: tip 优先级

1. 先分析产物
2. 做路由懒加载
3. 拆明显的大依赖
4. 优化公共 chunk
5. 对比构建结果和真实加载表现

:::

Webpack 和 Vite 的配置方式不同，但核心问题是一样的：首屏要少加载，稳定依赖要能缓存，异步页面不要提前下载。

Vue 和 React 的区别也没有想象中那么大。真正决定分包产物的是构建工具和动态导入，框架只是在懒加载写法上有所区别。

如果项目还不大，不需要一开始就把分包策略设计得很复杂。先把路由懒加载做好，再用分析工具看真实瓶颈，往往已经能解决大部分问题。优化这件事应该从实际问题出发。