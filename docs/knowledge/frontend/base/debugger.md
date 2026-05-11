---
layout: doc

lastUpdated: false
title: 前端 Debugger 技巧
description: 那些真正能提升效率的调试技巧
category: 前端基础
date: 2025-11-10
---

# 前端 Debugger 技巧

我觉得大部分前端开发者可能都和我一样，在工作中至少有三分之一的时间都是在和各种 bug 斗智斗勇。这些年来随着不断的学习以及遇到的 bug 的不同，我调试 bug 的方法也在逐步的增加，从最开始满屏的 `console.log` ，到现在能去运用各种工具快速定位问题，我在这里整理了以下我常用的一些调试技巧，比起传统的“打印大法”，它们帮我省下了不少时间。

## 1. Console 的正确打开方式

`console.log` 几乎是每个前端人的入门技能，但说实话，很多人用了好几年，也只用到了这一个方法。Console 面板的能力远不止于此。

**性能计时**

想知道一段代码或接口请求的耗时，别自己 `Date.now()` 相减了：

```javascript
console.time('接口请求');
await fetchUserInfo();
console.timeEnd('接口请求');
// 直接输出: 接口请求: 247ms
```

<img src="/markdown/frontend/debugger/console-timeEnd.png" alt="加载失败" />

**调用栈追踪**

不清楚某段代码到底是从哪被调用的？加一行 `console.trace()`，完整的调用栈直接给你打印出来，省得你一个个文件去翻。

**分组输出**

日志太多看不过来？用 `console.group()` 和 `console.groupEnd()` 给它们分个组，界面上就是可折叠的结构，清爽多了。

**格式化输出**

输出数组或对象时，`console.table()` 可以将数据以表格形式展示，比默认输出好读一万倍。

::: tip 小提示
Console 本身就是个完整的 JS 运行环境，你可以直接在里面写代码执行。断点模式下还能直接访问和修改当前作用域的变量。
:::

## 2. 五种断点类型与适用场景

Sources 面板的断点功能非常强大，除了最基础的"点行号打断点"这一种还有很多其它的方式。根据不同场景选对方式，能省好多事。

| 断点类型 | 适用场景 |
|---------|----------|
| 代码断点 | 本地开发时，已知问题的大致代码位置 |
| 源文件断点 | 线上环境调试，在打包后的资源中设置 |
| 网络断点 | 定位接口请求的调用来源 |
| DOM 断点 | 追踪 DOM 节点或属性的变更来源 |
| 事件断点 | 查找事件监听器的绑定位置 |

我最常用的就是 **网络断点** 和 **DOM 断点**。

在 XHR/fetch Breakpoints 里加个接口路径，请求发出去的时候自动断住，顺着 Call Stack 往上一翻就找到了。

<img src="/markdown/frontend/debugger/Network-breakpoint_1.png" alt="加载失败" />

DOM 断点同理。某个元素的样式莫名其妙被改了，右键那个元素 → Break on → attribute modifications，谁改的属性马上就发现了。

<img src="/markdown/frontend/debugger/Dom-breakpoint.png" alt="加载失败" />

## 3. 线上代码的本地调试

线上出 bug 是最头疼的，它不能像本地一样改完刷新看效果。但其实 Chrome 中是可以线上修改代码的。

<img src="/markdown/frontend/debugger/Override-content.png" alt="加载失败" />

找到你想改的文件，右键选择"Override content"，选个本地文件夹存着，然后你就可以直接在线上的代码里编辑了，保存完刷新页面就生效。

<img src="/markdown/frontend/debugger/Select-folder.png" alt="加载失败" />

::: danger 踩坑提醒
改完后要记得还原线上代码，不然下次电脑进入页面还是修改后的效果
:::

<img src="/markdown/frontend/debugger/Restore-online-code.png" alt="加载失败" />

但通常来说我们发到线上的静态资源为了减小包体积及防止源码泄露等问题，等会在发布前进行代码压缩和混淆，那么在可读性上会大打折扣，从而增加调试 bug 的难度

<img src="/markdown/frontend/debugger/Code-Minification&Obfuscation.png" alt="加载失败" />

方案：我们可以通过 Webpack 配置，来开启 SourceMap，本质上就是将源码保留并且和打包后的资源建立映射关系，在调试代码的时候，浏览器指向源码处，这样就能很轻松的进行调试了

具体步骤：
  1. 更改 Webpack 配置文件
  ```JavaScript
  module.exports = {
      ...,
      // 开发环境生成SourceMap, 一般不推荐包体积会增大，且代码易泄露
      productionSourceMap: true,
      configureWebpack: {
          // 开发环境开启SourceMap
          devtool: 'source-map'
      },
  }
  ```
  2. 浏览器中开启 SourceMap 支持

  <img src="/markdown/frontend/debugger/JavaScript-source-map.png" alt="加载失败" />

## 4. 接口联调效率提升

Network 面板提供了一个非常实用的功能：复制请求为 cURL 格式。

<img src="/markdown/frontend/debugger/Curl_1.png" alt="加载失败" />

找到目标请求，右键 → Copy → Copy as cURL。复制出的内容包含完整的请求头、请求体等信息，可以直接在终端执行复现请求，也可以分享给后端同学快速定位问题。

<img src="/markdown/frontend/debugger/Curl_2.png" alt="加载失败" />

用这个技巧每次和后端联调时可以极大提升沟通效率，省去了很多"我传的就是这个啊"、"你把截图发我看看"等的无效沟通。

## 5. 异常场景模拟

每次测试需要异常场景时，都让后端把接口 temporarily down 掉太费事了，在 Chrome 里直接右键请求 → Block request URL，刷新页面这个请求就会失败，正好用来测试你的降级逻辑和异常提示有没有做好。

<img src="/markdown/frontend/debugger/Block-request-URL.png" alt="加载失败" />

## 6. 移动端真机调试

移动端开发最头疼的就是：模拟器上好好的，一到真机就挂。

**H5 页面调试**

引入 vConsole 工具，可以在手机端直接查看控制台日志、网络请求、本地存储等信息。记得只在测试环境引入，别带到线上了。
``` html
<!-- 引入 vConsole -->
<script src="https://cdn.bootcss.com/vConsole/3.2.0/vconsole.min.js"></script>
```
在真机上运行，点击 VConsole 即可打开控制台，通过日志来进行问题排查

> [!IMPORTANT] 重要
> 通过 VConsole 让我们可以在真机进行 JS 层面的调试，那么如何进行 Dom 及样式层面的调试呢？
> 我们在此使用谷歌浏览器的 google-inspect 实现该需求
> 需要调试 DOM 和样式时，大致流程是这样的：
> 1. 手机连接数据线到电脑上
> 2. 打开手机开发者模式(一般都是在手机系统版本号处多次点击)
> 3. 开启开发者模式后，在手机设置中的开发者选项中打开 USB 调试
> 4. 在 PC 浏览器中访问 chrome://inspect/#devices(需要翻墙)
> 5. 访问后，你手机上访问的浏览器资源会在该页面显示，找到对应页面点击 inspect 即可映射资源到 PC 浏览器上进行调试

**小程序调试**

微信开发者工具自带真机调试功能，内置了自己的开发者工具供我们在真机上使用，只需要在手机小程序上开启即可

## 最后

其实调试这件事，我觉得工具是次要的，关键在于思路。

以前我一遇到问题，第一反应就是"这怎么可能"、"刚才还好好的"，然后就直接开始翻代码找原因，这样其实效率非常低。

我的经验是：先复现，再想最近改了什么，然后缩小范围，最后定位原因。工具只是帮助我们把这个过程变快而已。
