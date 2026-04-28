---
layout: doc

lastUpdated: false
title: 四种Web实时通信方案解析
description: 短轮询、长轮询、SSE、WebSocket 原理解析、优缺点对比与选型指南
category: 前端基础
date: 2026-04-27
---

# 四种Web实时通信方案解析

在日常前端开发中，我们最常用的就是 HTTP 请求了——点击按钮发个 POST，拉取数据发个 GET，完事连接就断了。大部分场景下这完全够用。

但总有那么些场景，HTTP 就显得力不从心了：
- 做个聊天室，总不能让用户每隔一秒刷新页面吧？
- 在线协作文档，对方改了内容怎么实时同步过来？
- 股票行情、实时监控，延迟个几秒体验就差很多

这时候我们就需要「实时通信」技术了。今天这篇文章，我会把前端常用的四种实时通信方案挨个讲明白：短轮询、长轮询、SSE、WebSocket。

不搞太多花里胡哨的术语，用最直白的方式告诉你它们各自是怎么工作的，有什么优缺点，以及实际项目中该怎么选。

## 一、短轮询 (Short Polling)：最简单粗暴的方式

### 工作原理

短轮询说白了就是：浏览器每隔一段时间就给服务器发个请求，问"有没有新数据啊？"，服务器不管有没有都直接返回。

用个生活化的比喻：你每隔5分钟就给外卖小哥打个电话，问"我的餐做好了吗？"——不管做好没做好，他都会回复你，然后你挂了电话等5分钟再打过去。

### 代码实现

前端代码超级简单：

```javascript
// 每隔3秒请求一次最新数据
setInterval(async () => {
  const response = await fetch('/api/messages');
  const data = await response.json();
  updateUI(data);
}, 3000);
```

### 优缺点

**优点：**
- 实现超级简单，几乎没有学习成本
- 兼容性无敌，什么浏览器都支持
- 服务端实现也简单，不需要额外改架构

**缺点：**
- **太浪费资源了**——大部分请求都是空手而归，白白消耗带宽和服务器资源
- **延迟高**——消息至少要等半个轮询间隔才能拿到
- 并发用户一多，服务器压力会爆炸

::: warning 踩坑提醒
我早期做一个小项目图省事用了短轮询，结果上线后发现服务器 QPS 直接翻了十几倍。后来算一笔账：1000 个用户，每 3 秒轮询一次，就是每秒 300+ 请求，而其中 90% 以上的请求都只是返回一个空数组。这个教训告诉我：短轮询真的只适合用户量特别小的内部系统。
:::

### 适用场景

- 用户量很少的内部工具、后台系统
- 实时性要求不高（比如 30 秒以上延迟都能接受）
- 快速做 Demo 验证产品思路

## 二、长轮询 (Long Polling)：在短轮询基础上的改进

### 工作原理

长轮询和短轮询的思路类似，但做了一个关键优化：**请求发过去后，如果没有新数据，服务器不立即返回，而是把这个请求挂起，一直等到有数据了才返回，或者超时了再返回。**

还是用外卖的比喻：你给外卖小哥打电话，说"餐好了再告诉我，我不挂电话"，然后就一直在线等着，要么餐好了告诉你，要么等太久了你自己挂了重打。

### 代码实现

**前端：**
```javascript
async function longPoll() {
  try {
    const response = await fetch('/api/messages/long-poll');
    const data = await response.json();
    
    // 拿到数据了，先处理业务逻辑
    updateUI(data);
    
    // 处理完立即发起下一次请求
    longPoll();
  } catch (error) {
    // 出错了，等1秒后重试，避免死循环
    setTimeout(longPoll, 1000);
  }
}

// 启动长轮询
longPoll();
```

**服务端大概的逻辑：**
```javascript
app.get('/api/messages/long-poll', async (req, res) => {
  const startTime = Date.now();
  
  // 循环检查有没有新消息，最多等待30秒
  while (Date.now() - startTime < 30000) {
    const messages = await getNewMessages();
    if (messages.length > 0) {
      return res.json(messages);
    }
    // 等100ms再查一次
    await sleep(100);
  }
  
  // 30秒超时了，返回空，让前端重连
  res.json([]);
});
```

### 优缺点

**优点：**
- 比短轮询省很多资源——没有数据的时候不会频繁请求
- 实时性也不错，有数据了能立即返回
- 还是基于 HTTP，兼容性也很好
- 相对 WebSocket 来说，服务端改造成本低一些

**缺点：**
- 连接挂起也会消耗服务器资源，并发上来了还是有压力
- 每次返回数据后都要重新建立连接，有一定开销
- 只能服务器被动等待，没法主动推送（还是得靠前端发起连接）

::: tip 小提示
很多早期的 Web IM 产品都是基于长轮询实现的，包括早期的微信网页版。长轮询可以说是一种"够用但不够优雅"的折中方案。
:::

### 适用场景

- 需要一定实时性，但又不想上 WebSocket 那么重的方案
- 需要兼容一些比较老的浏览器环境
- 消息频率不算特别高的场景

## 三、SSE (Server-Sent Events)：服务器单向推送

### 工作原理

SSE 是 HTML5 新增的一个 API，它允许服务器向客户端单向推送数据。注意关键词：**单向**——只能服务器给客户端发，客户端不能给服务器发。

继续外卖比喻：这次你不用反复打电话了，你跟外卖小哥说"餐好了你直接给我送过来就行，不用问我"，然后你就在家等着。小哥只负责送餐，不负责接收你的其他消息。

SSE 本质上还是 HTTP 协议，只是服务器返回的是一个特殊的 `Content-Type: text/event-stream`，告诉浏览器"这是一个流数据，不要断开连接"。

### 代码实现

**前端超级简单：**
```javascript
// 创建 SSE 连接
const eventSource = new EventSource('/api/stream');

// 监听消息
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateUI(data);
};

// 监听连接打开
eventSource.onopen = () => {
  console.log('SSE 连接已建立');
};

// 监听错误
eventSource.onerror = (error) => {
  console.error('SSE 出错:', error);
};

// 关闭连接
// eventSource.close();
```

**服务端也不复杂：**
```javascript
app.get('/api/stream', (req, res) => {
  // 设置响应头，告诉浏览器这是 SSE 流
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  
  // 定时发送心跳，防止连接被断开
  const heartbeat = setInterval(() => {
    res.write('event: heartbeat\n');
    res.write(`data: ${Date.now()}\n\n`);
  }, 30000);
  
  // 有新消息时推送
  const messageListener = (message) => {
    res.write('data: ');
    res.write(JSON.stringify(message));
    res.write('\n\n');
  };
  
  messageBus.on('new-message', messageListener);
  
  // 连接断开时清理
  req.on('close', () => {
    clearInterval(heartbeat);
    messageBus.off('new-message', messageListener);
  });
});
```

### 优缺点

**优点：**
- API 超级简单，前端几行代码搞定
- 真正的服务器主动推送，不需要前端轮询
- 自动重连（浏览器内置了断线重连机制）
- 可以自定义事件类型
- 资源消耗比轮询小很多

**缺点：**
- **只能单向通信**——服务器推给客户端，反过来不行
- 有并发连接数限制（浏览器对同一个域名最多 6 个 SSE 连接）
- 默认只支持 GET 请求，带参数不太方便
- 不支持二进制数据，只能发 UTF-8 文本

::: danger 踩坑提醒
SSE 有个巨坑：很多反向代理（比如 Nginx）默认会缓冲响应，导致消息被卡住不推送。一定要记得在代理配置里关掉缓冲，或者让服务端发送 `X-Accel-Buffering: no` 响应头。我当时因为这个问题排查了整整一下午...
:::

### 适用场景

- 只需要服务器推送，不需要客户端频繁发消息的场景
- 实时数据看板、股票行情、新闻推送
- 日志实时展示、进度条更新

## 四、WebSocket：真正的全双工通信

### 工作原理

WebSocket 是 HTML5 新增的协议，它和 HTTP 完全不一样——建立连接后，客户端和服务器之间可以**双向、实时**地收发数据，没有 HTTP 的请求-响应模式限制。

这一次就不是打电话了，而是直接开了个视频通话——你能说话，对方也能说话，而且是实时的，不用等对方说完你再说。

WebSocket 的建立过程也很有意思：它先通过 HTTP 做一次"握手"，告诉服务器"我要升级成 WebSocket 协议"，服务器同意后，就切换到 WebSocket 协议，之后就和 HTTP 没关系了。

### 代码实现

**前端：**
```javascript
// 建立 WebSocket 连接
const socket = new WebSocket('wss://your-server.com/ws');

// 连接打开
socket.onopen = () => {
  console.log('WebSocket 连接已建立');
  // 发送消息
  socket.send(JSON.stringify({
    type: 'join',
    roomId: 'chat-room-123'
  }));
};

// 接收消息
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateUI(data);
};

// 连接关闭
socket.onclose = () => {
  console.log('WebSocket 连接已关闭');
  // 可以在这里做重连逻辑
};

// 出错
socket.onerror = (error) => {
  console.error('WebSocket 出错:', error);
};
```

**服务端（以 Node.js 的 ws 库为例）：**
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('新的客户端连接');
  
  // 接收客户端消息
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    // 广播给其他客户端
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'message',
          content: data.content
        }));
      }
    });
  });
});
```

### 优缺点

**优点：**
- **真正的全双工通信**——客户端和服务器想发就发
- 实时性最好，延迟最低
- 协议头很小，数据传输开销小
- 支持二进制数据
- 性能最好，能支撑的并发最高

**缺点：**
- 实现最复杂，服务端需要单独维护 WebSocket 服务
- 需要处理各种异常情况：断线重连、心跳保活、消息丢失等
- 负载均衡比较麻烦
- 代理层、防火墙可能会拦截 WebSocket 连接
- 开发调试相对麻烦一些

::: tip 小提示
实际项目中很少直接用原生 WebSocket，一般都会用封装好的库，比如 [Socket.IO](https://socket.io/)。它不仅封装了重连、心跳、消息确认这些基础能力，还支持降级策略——如果 WebSocket 连不上，会自动降级成长轮询，兼容性拉满。
:::

### 适用场景

- 真正需要双向实时通信的场景：聊天室、在线游戏
- 在线协作工具（文档、白板、代码协作）
- 实时多人互动场景
- 消息频率很高的场景

## 四种方案对比总结

我整理了一张对比表，方便大家快速对照：

| 特性 | 短轮询 | 长轮询 | SSE | WebSocket |
|------|--------|--------|-----|-----------|
| **通信方向** | 客户端→服务器 | 客户端→服务器 | 服务器→客户端（单向） | 双向 |
| **实时性** | 差（取决于轮询间隔） | 较好 | 好 | 最好 |
| **实现复杂度** | 最简单 | 简单 | 简单 | 复杂 |
| **服务器负载** | 最高 | 中等 | 低 | 最低 |
| **浏览器兼容性** | 无敌 | 无敌 | IE10+ | IE10+ |
| **需要心跳** | 不需要 | 不需要 | 建议 | 必须 |
| **自动重连** | 自己实现 | 自己实现 | 浏览器内置 | 自己实现 |
| **支持二进制** | 支持 | 支持 | 不支持 | 支持 |

## 实际项目中该怎么选？

给大家一个简单的决策路径：

1. **如果只需要服务器推送，不需要客户端发消息** → 选 SSE
   - 比如：新闻推送、实时看板、日志流
   - SSE 足够简单，性能也不错

2. **如果需要双向通信，消息频率比较高** → 选 WebSocket
   - 比如：聊天室、在线游戏、协作文档
   - 体验最好，一步到位

3. **如果用户量特别小，只是个内部工具** → 短轮询也不是不行
   - 开发速度最快，怎么简单怎么来

4. **如果需要兼容特别老的浏览器** → 长轮询
   - 现在这种场景已经很少了

> 说句实在话，现在大部分项目，要么用 SSE，要么用 WebSocket（Socket.IO）。轮询方案更多是历史产物了，新项目不太建议用。
